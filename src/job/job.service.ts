import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { PublishJobDto } from './dto/publish-job.dto'
import { FilterJobDto } from './dto/filter-job.dto'
import { JobStatus } from '@prisma/client'

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, organizationId: string, userId: string) {
    return this.prisma.job.create({
      data: {
        ...createJobDto,
        organizationId,
        createdById: userId,
        versions: {
          create: {
            version: 1,
            content: {},
            createdBy: userId,
            published: false
          }
        }
      } as any,
      include: {
        versions: {
          orderBy: { version: 'desc' }
        },
      }
    })
  }

  async findAll(filterDto: FilterJobDto, organizationId: string) {
    const { title, family, area, level, status, take = 10, skip = 0 } = filterDto

    const where = {
      organizationId,
      ...(title && { title: { contains: title, mode: 'insensitive' as const } }),
      ...(family && { family: { contains: family, mode: 'insensitive' as const } }),
      ...(area && { area: { contains: area, mode: 'insensitive' as const } }),
      ...(level && { level: { contains: level, mode: 'insensitive' as const } }),
      ...(status && { status })
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        include: {
          versions: {
            orderBy: { version: 'desc' },
            take: 1
          }
        },
        take,
        skip,
        orderBy: { updatedAt: 'desc' }
      }),
      this.prisma.job.count({ where })
    ])

    return {
      data: jobs,
      total,
      take,
      skip
    }
  }

  async findOne(id: string, organizationId: string) {
    const job = await this.prisma.job.findFirst({
      where: { id, organizationId },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        },
      }
    })

    if (!job) {
      throw new NotFoundException('Cargo não encontrado')
    }

    return job
  }

  async update(id: string, updateJobDto: UpdateJobDto, organizationId: string) {
    const job = await this.findOne(id, organizationId)

    // Apenas cargos em DRAFT ou REVIEWING podem ser editados
    if (job.status === JobStatus.PUBLISHED) {
      throw new BadRequestException('Cargos publicados não podem ser editados')
    }

    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    })
  }

  async submit(id: string, organizationId: string) {
    const job = await this.findOne(id, organizationId)

    if (job.status !== JobStatus.DRAFT) {
      throw new BadRequestException('Apenas cargos em rascunho podem ser submetidos para revisão')
    }

    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.REVIEWING },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    })
  }

  async publish(id: string, publishJobDto: PublishJobDto, organizationId: string, userId: string) {
    const job = await this.findOne(id, organizationId)

    if (job.status !== JobStatus.REVIEWING) {
      throw new BadRequestException('Apenas cargos em revisão podem ser publicados')
    }

    // Obter a próxima versão
    const lastVersion = await this.prisma.jobVersion.findFirst({
      where: { jobId: id },
      orderBy: { version: 'desc' }
    })

    const nextVersion = (lastVersion?.version || 0) + 1

    // Criar nova versão publicada
    const newVersion = await this.prisma.jobVersion.create({
      data: {
        jobId: id,
        version: nextVersion,
        content: publishJobDto.content,
        createdBy: userId,
        published: true
      }
    })

    // Atualizar o job
    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.PUBLISHED,
        currentVersion: newVersion.id
      },
      include: {
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    })
  }

  async remove(id: string, organizationId: string, userRole: string) {
    // Apenas ADMIN_RH pode excluir cargos
    if (userRole !== 'ADMIN_RH') {
      throw new ForbiddenException('Apenas administradores de RH podem excluir cargos')
    }

    const job = await this.findOne(id, organizationId)

    return this.prisma.job.delete({
      where: { id }
    })
  }

  async compareVersions(jobId: string, versionA: number, versionB: number, organizationId: string) {
    const job = await this.findOne(jobId, organizationId)

    const [versionAData, versionBData] = await Promise.all([
      this.prisma.jobVersion.findFirst({
        where: { jobId, version: versionA }
      }),
      this.prisma.jobVersion.findFirst({
        where: { jobId, version: versionB }
      })
    ])

    if (!versionAData || !versionBData) {
      throw new NotFoundException('Uma ou ambas as versões não foram encontradas')
    }

    return {
      job: {
        id: job.id,
        title: job.title
      },
      versionA: {
        version: versionAData.version,
        content: versionAData.content,
        createdAt: versionAData.createdAt,
        published: versionAData.published
      },
      versionB: {
        version: versionBData.version,
        content: versionBData.content,
        createdAt: versionBData.createdAt,
        published: versionBData.published
      }
    }
  }
}
