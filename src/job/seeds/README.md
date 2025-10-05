# Seeds de Cargos

Este diretório contém seeds opcionais para popular o banco de dados com dados de teste.

## Como usar

### 1. Importar o seed no seu código

```typescript
import { seedJobs } from './seeds/job-seeds'
import { PrismaService } from '../db/prisma.service'

// Exemplo de uso em um script ou endpoint
async function runSeeds() {
  const prisma = new PrismaService()
  
  // IDs de exemplo - substitua pelos IDs reais do seu banco
  const organizationId = 'sua-organization-id'
  const userId = 'seu-user-id'
  
  await seedJobs(prisma, organizationId, userId)
}
```

### 2. Executar via endpoint (desenvolvimento)

Você pode criar um endpoint temporário para executar os seeds:

```typescript
// Em um controller de desenvolvimento
@Post('dev/seed-jobs')
async seedJobs(@Request() req) {
  const { session } = req
  const organizationId = session.activeOrganizationId
  const userId = req.user.id
  
  await seedJobs(this.prisma, organizationId, userId)
  return { message: 'Seeds executados com sucesso' }
}
```

### 3. Dados incluídos

Os seeds incluem 3 cargos de exemplo:

1. **Desenvolvedor Full Stack** (DRAFT)
   - Família: Tecnologia
   - Área: Desenvolvimento
   - Nível: Pleno

2. **Analista de RH** (PUBLISHED)
   - Família: Recursos Humanos
   - Área: Gestão de Pessoas
   - Nível: Júnior

3. **Gerente de Projetos** (REVIEWING)
   - Família: Gestão
   - Área: Projetos
   - Nível: Sênior

### 4. Estrutura do Content

O campo `content` de cada versão segue esta estrutura:

```json
{
  "mission": "Descrição da missão do cargo",
  "responsibilities": ["Responsabilidade 1", "Responsabilidade 2"],
  "requirements": ["Requisito 1", "Requisito 2"],
  "skills": ["Habilidade 1", "Habilidade 2"]
}
```

Esta estrutura é flexível e pode ser adaptada conforme necessário.
