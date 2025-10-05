import { PrismaService } from '../../db/prisma.service'

export const jobSeeds = [
  {
    title: 'Desenvolvedor Full Stack',
    family: 'Tecnologia',
    area: 'Desenvolvimento',
    level: 'Pleno',
    status: 'DRAFT' as const,
    content: {
      mission: 'Desenvolver e manter aplicações web completas, desde o frontend até o backend',
      responsibilities: [
        'Desenvolver interfaces de usuário responsivas',
        'Implementar APIs RESTful',
        'Integrar com bancos de dados',
        'Participar de code reviews',
        'Documentar código e processos'
      ],
      requirements: [
        'Superior completo em Ciência da Computação ou área relacionada',
        'Experiência com React e Node.js',
        'Conhecimento em bancos de dados SQL',
        'Experiência com Git',
        'Inglês intermediário'
      ],
      skills: [
        'JavaScript/TypeScript',
        'React',
        'Node.js',
        'PostgreSQL',
        'Docker'
      ]
    }
  },
  {
    title: 'Analista de RH',
    family: 'Recursos Humanos',
    area: 'Gestão de Pessoas',
    level: 'Júnior',
    status: 'PUBLISHED' as const,
    content: {
      mission: 'Apoiar as atividades de recursos humanos da organização',
      responsibilities: [
        'Recrutamento e seleção de candidatos',
        'Acompanhamento de processos de admissão',
        'Gestão de benefícios',
        'Suporte ao departamento pessoal',
        'Organização de treinamentos'
      ],
      requirements: [
        'Superior completo em Administração, Psicologia ou área relacionada',
        'Conhecimento em legislação trabalhista',
        'Experiência com sistemas de RH',
        'Boa comunicação',
        'Organização e proatividade'
      ],
      skills: [
        'Recrutamento e seleção',
        'Gestão de benefícios',
        'Legislação trabalhista',
        'Excel avançado',
        'Comunicação'
      ]
    }
  },
  {
    title: 'Gerente de Projetos',
    family: 'Gestão',
    area: 'Projetos',
    level: 'Sênior',
    status: 'REVIEWING' as const,
    content: {
      mission: 'Liderar e gerenciar projetos estratégicos da organização',
      responsibilities: [
        'Planejar e executar projetos',
        'Gerenciar equipes multidisciplinares',
        'Acompanhar cronogramas e orçamentos',
        'Comunicar status para stakeholders',
        'Identificar e mitigar riscos'
      ],
      requirements: [
        'Superior completo',
        'Certificação PMP ou equivalente',
        'Experiência mínima de 5 anos em gestão de projetos',
        'Liderança e comunicação',
        'Inglês fluente'
      ],
      skills: [
        'Metodologias ágeis',
        'Gestão de equipes',
        'Planejamento estratégico',
        'Comunicação executiva',
        'Ferramentas de gestão'
      ]
    }
  }
]

export async function seedJobs(prisma: PrismaService, organizationId: string, userId: string) {
  console.log('🌱 Iniciando seeds de cargos...')

  for (const jobData of jobSeeds) {
    const { content, ...jobFields } = jobData

    // Criar o job
    const job = await prisma.job.create({
      data: {
        ...jobFields,
        organizationId,
        createdById: userId
      } as any
    })

    // Criar versão inicial
    await prisma.jobVersion.create({
      data: {
        jobId: job.id,
        version: 1,
        content,
        createdBy: userId,
        published: jobData.status === 'PUBLISHED'
      }
    })

    // Se for publicado, atualizar currentVersion
    if (jobData.status === 'PUBLISHED') {
      const publishedVersion = await prisma.jobVersion.findFirst({
        where: { jobId: job.id, published: true }
      })

      if (publishedVersion) {
        await prisma.job.update({
          where: { id: job.id },
          data: { currentVersion: publishedVersion.id }
        })
      }
    }

    console.log(`✅ Cargo criado: ${job.title}`)
  }

  console.log('🎉 Seeds de cargos concluídos!')
}
