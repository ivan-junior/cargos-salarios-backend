# Módulo Job - Descrição de Cargos

Este módulo implementa o sistema de gestão de cargos com versionamento automático e suporte multi-organização.

## Funcionalidades

### ✅ Implementadas

- **Criação de Cargos**: Endpoint `POST /jobs`
- **Edição de Cargos**: Endpoint `PUT /jobs/:id`
- **Submissão para Revisão**: Endpoint `PUT /jobs/:id/submit`
- **Publicação**: Endpoint `PUT /jobs/:id/publish`
- **Listagem com Filtros**: Endpoint `GET /jobs`
- **Detalhe do Cargo**: Endpoint `GET /jobs/:id`
- **Exclusão**: Endpoint `DELETE /jobs/:id`
- **Comparação de Versões**: Endpoint `GET /jobs/:id/compare/:versionA/:versionB`

### 🔐 Controle de Acesso

- Autenticação obrigatória via `AuthGuard`
- Isolamento por organização (`organizationId`)
- Controle de permissões por `MemberRole`
- Apenas `ADMIN_RH` pode excluir cargos

## Estrutura de Arquivos

```
src/job/
├── dto/
│   ├── create-job.dto.ts      # DTO para criação
│   ├── update-job.dto.ts      # DTO para edição
│   ├── publish-job.dto.ts     # DTO para publicação
│   └── filter-job.dto.ts      # DTO para filtros
├── seeds/
│   ├── job-seeds.ts           # Seeds para testes
│   └── README.md              # Documentação dos seeds
├── job.controller.ts          # Controller com endpoints
├── job.service.ts             # Lógica de negócio
├── job.module.ts             # Módulo NestJS
└── README.md                   # Esta documentação
```

## Endpoints

### POST /jobs
Cria um novo cargo em status `DRAFT`.

**Body:**
```json
{
  "title": "Desenvolvedor Full Stack",
  "family": "Tecnologia",
  "area": "Desenvolvimento",
  "level": "Pleno"
}
```

### GET /jobs
Lista cargos com filtros opcionais.

**Query Parameters:**
- `title`: Filtro por título (busca parcial)
- `family`: Filtro por família
- `area`: Filtro por área
- `level`: Filtro por nível
- `status`: Filtro por status (`DRAFT`, `REVIEWING`, `PUBLISHED`)
- `take`: Limite de resultados (padrão: 10)
- `skip`: Offset para paginação (padrão: 0)

### GET /jobs/:id
Retorna detalhes de um cargo específico com todas as versões.

### PUT /jobs/:id
Atualiza campos básicos do cargo (apenas em `DRAFT` ou `REVIEWING`).

### PUT /jobs/:id/submit
Submete cargo para revisão (muda status para `REVIEWING`).

### PUT /jobs/:id/publish
Publica uma versão do cargo.

**Body:**
```json
{
  "content": {
    "mission": "Desenvolver aplicações web",
    "responsibilities": ["Coding", "Testing"],
    "requirements": ["Superior completo"],
    "skills": ["JavaScript", "React"]
  }
}
```

### DELETE /jobs/:id
Exclui um cargo (apenas `ADMIN_RH`).

### GET /jobs/:id/compare/:versionA/:versionB
Compara duas versões de um cargo.

## Fluxo de Status

```
DRAFT → REVIEWING → PUBLISHED
  ↑         ↓
  └─────────┘
```

- **DRAFT**: Cargo em criação/edição
- **REVIEWING**: Cargo submetido para revisão
- **PUBLISHED**: Cargo publicado (não pode mais ser editado)

## Estrutura do Content

O campo `content` é flexível e pode conter qualquer estrutura JSON. Exemplo:

```json
{
  "mission": "Descrição da missão",
  "responsibilities": ["Responsabilidade 1", "Responsabilidade 2"],
  "requirements": ["Requisito 1", "Requisito 2"],
  "skills": ["Habilidade 1", "Habilidade 2"],
  "customField": "Valor personalizado"
}
```

## Versionamento

- Cada publicação cria uma nova versão
- Versões são numeradas sequencialmente
- Histórico completo é mantido
- Apenas a versão mais recente é considerada "atual"

## Seeds para Testes

Use os seeds incluídos para popular o banco com dados de teste:

```typescript
import { seedJobs } from './seeds/job-seeds'

await seedJobs(prisma, organizationId, userId)
```

## Próximos Passos

Este módulo está preparado para futuras expansões:

- **Competências**: Adicionar sistema de competências técnicas
- **Histórico de Aprovação**: Workflow de aprovação
- **IA**: Integração com IA para sugestões
- **Templates**: Templates de descrição de cargos
- **Relatórios**: Relatórios de cargos por área/família
