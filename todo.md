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

## Logos de Empresas
- [x] Substituir emojis por logos reais das empresas (Asaas e Cobre Fácil)
- [x] Criar cards com logos em formato adequado

## Página de Detalhes de Boleto
- [x] Criar página de detalhes de boleto individual
- [x] Mostrar todas as informações do boleto
- [x] Adicionar ações de editar, cancelar e excluir
- [x] Tornar boletos clicáveis na tela de Boletos
- [x] Tornar boletos clicáveis na página de detalhes de upload
- [x] Adicionar rota de detalhes de boleto

## Telas de Login e Cadastro
- [x] Criar tela de Login com email/senha
- [x] Criar tela de Cadastro com validação
- [ ] Adicionar recuperação de senha
- [x] Implementar validação de formulários
- [x] Adicionar feedback visual de erros

## Migração tRPC → REST API
- [ ] Criar endpoints REST no backend
- [ ] Implementar autenticação JWT
- [ ] Migrar chamadas do frontend para fetch/axios
- [ ] Atualizar toda a documentação
- [ ] Remover dependências do tRPC

## Validação de CNPJ no Cadastro
- [x] Adicionar campo de CNPJ no formulário de cadastro
- [x] Implementar validação de CNPJ
- [x] Adicionar máscara de formatação (00.000.000/0000-00)
- [ ] Validar CNPJ no backend

## Integração com API REST do Backend
- [x] Criar serviço de API REST no frontend (api.ts)
- [x] Implementar autenticação com JWT
- [x] Criar endpoints para importação em lote
- [x] Atualizar tela de Upload para usar nova API
- [x] Criar tela de acompanhamento de importações
- [x] Adicionar polling para status de importação
- [x] Implementar retry de importações falhadas
- [ ] Substituir todas as chamadas tRPC por REST

## Git e Repositório
- [ ] Inicializar repositório Git
- [ ] Criar repositório remoto boleto-api-front
- [ ] Fazer commit inicial
- [ ] Push para GitHub
