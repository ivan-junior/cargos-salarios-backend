# Notas de Migração - Schema Prisma

## Mudanças Realizadas

### 1. Adicionado relacionamento `createdById` no model `Job`

**Antes:**
```prisma
model Job {
  id             String       @id @default(uuid(7))
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  title          String
  // ... outros campos
  versions       JobVersion[]
}
```

**Depois:**
```prisma
model Job {
  id             String       @id @default(uuid(7))
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  title          String
  // ... outros campos
  createdById    String
  createdBy      User         @relation(fields: [createdById], references: [id])
  versions       JobVersion[]
}
```

### 2. Adicionado relacionamento `createdJobs` no model `User`

**Antes:**
```prisma
model User {
  id            String       @id @default(uuid(7))
  // ... outros campos
  sessions      Session[]
  accounts      Account[]
  members       Member[]
  invitations   Invitation[]
}
```

**Depois:**
```prisma
model User {
  id            String       @id @default(uuid(7))
  // ... outros campos
  sessions      Session[]
  accounts      Account[]
  members       Member[]
  invitations   Invitation[]
  createdJobs   Job[]
}
```

## Próximos Passos

1. **Regenerar o cliente Prisma:**
   ```bash
   npx prisma generate
   ```

2. **Criar e executar a migração:**
   ```bash
   npx prisma migrate dev --name add_created_by_to_job
   ```

3. **Verificar se tudo está funcionando:**
   ```bash
   npm run build
   ```

## Impacto no Código

- O campo `createdById` agora é obrigatório na criação de jobs
- O relacionamento `createdBy` permite buscar informações do usuário criador
- Os includes com `createdBy` funcionarão após a regeneração do cliente
- Os `as any` temporários podem ser removidos após a regeneração

## Estrutura Final

Após a migração, você poderá fazer queries como:

```typescript
// Buscar job com criador
const job = await prisma.job.findFirst({
  where: { id },
  include: {
    createdBy: {
      select: { id: true, name: true, email: true }
    },
    versions: {
      orderBy: { version: 'desc' }
    }
  }
})

// Buscar jobs criados por um usuário
const userJobs = await prisma.job.findMany({
  where: { createdById: userId }
})
```
