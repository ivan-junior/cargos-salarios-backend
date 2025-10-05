import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request
} from '@nestjs/common'
import { JobService } from './job.service'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { PublishJobDto } from './dto/publish-job.dto'
import { FilterJobDto } from './dto/filter-job.dto'
import { Session, type UserSession } from '@thallesp/nestjs-better-auth'

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}
  
  @Post()
  create(@Body() createJobDto: CreateJobDto, @Session() userSession: UserSession) {
    const { user, session } = userSession
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.create(createJobDto, organizationId, user.id)
  }

  @Get()
  findAll(@Query() filterDto: FilterJobDto, @Request() req) {
    const { session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.findAll(filterDto, organizationId)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const { session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.findOne(id, organizationId)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req) {
    const { session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.update(id, updateJobDto, organizationId)
  }

  @Patch(':id/submit')
  submit(@Param('id') id: string, @Request() req) {
    const { session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.submit(id, organizationId)
  }

  @Patch(':id/publish')
  publish(@Param('id') id: string, @Body() publishJobDto: PublishJobDto, @Request() req) {
    const { user, session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.publish(id, publishJobDto, organizationId, user.id)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const { session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    // Obter o role do usuário na organização
    const userRole = session.memberRole || 'LEITOR'

    return this.jobService.remove(id, organizationId, userRole)
  }

  @Get(':id/compare/:versionA/:versionB')
  compareVersions(
    @Param('id') id: string,
    @Param('versionA') versionA: string,
    @Param('versionB') versionB: string,
    @Request() req
  ) {
    const { session } = req
    const organizationId = session.activeOrganizationId

    if (!organizationId) {
      throw new Error('Organização ativa não encontrada')
    }

    return this.jobService.compareVersions(
      id,
      parseInt(versionA),
      parseInt(versionB),
      organizationId
    )
  }
}
