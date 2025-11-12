# ConectaAPI - TODO

## Autenticação e Cadastro
- [x] Sistema de login para empresas
- [x] Sistema de cadastro para empresas
- [x] Proteção de rotas autenticadas

## Configuração de APIs
- [x] Tela de configuração de APIs
- [x] Toggle para ativar/desativar APIs
- [x] Formulário de configuração para Asaas
- [x] Formulário de configuração para Cobre Fácil
- [x] Salvar configurações no banco de dados
- [x] Listar APIs configuradas pelo usuário

## Dashboard
- [x] Tela de dashboard inicial
- [x] Estatísticas básicas (placeholder para futuro)

## Upload de Planilhas
- [x] Tela de upload de planilhas
- [x] Seletor de API para upload
- [x] Link para download de planilha exemplo
- [x] Funcionalidade de upload de arquivo
- [x] Modal de sucesso/erro com resposta do backend
- [x] Processamento de planilha (mock inicial)

## Backend e Banco de Dados
- [x] Schema do banco de dados para configurações de API
- [x] Schema do banco de dados para uploads
- [x] Endpoints tRPC para configuração de APIs
- [x] Endpoints tRPC para upload de planilhas
- [x] Mocks de resposta do backend

## Design e UI
- [x] Layout com sidebar para navegação
- [x] Estilo consistente com Tailwind
- [x] Responsividade mobile

## Gerenciamento de Boletos
- [x] Schema do banco de dados para boletos
- [x] Endpoints tRPC para listar boletos
- [x] Endpoints tRPC para editar boleto
- [x] Endpoints tRPC para excluir boleto
- [x] Endpoints tRPC para cancelar boleto
- [x] Tela de listagem de boletos com tabela
- [x] Exibir campos: Nosso ID, API origem, valor, data criação, data vencimento
- [x] Ícones de ação: editar, excluir, cancelar
- [x] Modal de edição de boleto
- [x] Modal de confirmação para exclusão
- [x] Modal de confirmação para cancelamento
- [x] Integração com mock de APIs (Asaas/Cobre Fácil)
- [x] Adicionar rota de Boletos na navegação

## Dados Mock para Testes
- [x] Script de seed para popular banco de dados
- [x] Dados mock de configurações de API
- [x] Dados mock de uploads
- [x] Dados mock de boletos com diferentes status
- [x] Executar script e verificar dados no sistema

## Melhorias de UI/UX
- [x] Melhorar página inicial (Home) com animações e gradientes
- [x] Aprimorar Dashboard com cards mais atrativos
- [x] Adicionar skeleton loaders em todas as páginas
- [x] Melhorar tela de Configuração de APIs com melhor organização
- [ ] Implementar drag & drop na tela de Upload
- [ ] Adicionar filtros e busca na tela de Boletos
- [x] Melhorar feedback visual de ações (toasts, loading states)
- [x] Adicionar transições suaves entre páginas
- [x] Melhorar responsividade mobile
- [x] Adicionar badges e indicadores visuais

## Página de Detalhes de Upload
- [x] Criar schema para vincular boletos com uploads
- [x] Adicionar campo uploadId na tabela de boletos
- [x] Criar página de detalhes de upload
- [x] Mostrar informações do upload (arquivo, data, API, status)
- [x] Listar todos os boletos gerados pelo upload
- [x] Adicionar filtros por período (7, 15, 30 dias)
- [x] Adicionar filtro por status de boleto
- [x] Adicionar filtro por API
- [x] Tornar uploads no dashboard clicáveis
- [x] Atualizar seed para vincular boletos com uploads
