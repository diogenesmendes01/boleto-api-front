import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Conectar ao banco de dados
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("🌱 Iniciando seed de dados mock com vinculação de uploads...");

// Buscar o primeiro usuário
const [users] = await connection.query("SELECT * FROM users LIMIT 1");

if (!users || users.length === 0) {
  console.error("❌ Nenhum usuário encontrado. Faça login no sistema primeiro!");
  process.exit(1);
}

const userId = users[0].id;
console.log(`✅ Usuário encontrado: ${users[0].name} (ID: ${userId})`);

// Limpar dados existentes
console.log("🧹 Limpando dados antigos...");
await connection.query("DELETE FROM boletos WHERE userId = ?", [userId]);
await connection.query("DELETE FROM uploads WHERE userId = ?", [userId]);
await connection.query("DELETE FROM api_configurations WHERE userId = ?", [userId]);

// 1. Inserir configurações de API
console.log("📝 Inserindo configurações de API...");
await connection.query(`
  INSERT INTO api_configurations (userId, apiProvider, isActive, apiKey, apiSecret, createdAt, updatedAt)
  VALUES 
    (?, 'asaas', 1, 'asaas_test_key_123456', 'asaas_test_secret_789', NOW(), NOW()),
    (?, 'cobrefacil', 1, 'cobrefacil_test_key_abc', 'cobrefacil_test_secret_xyz', NOW(), NOW())
`, [userId, userId]);

// 2. Inserir uploads
console.log("📤 Inserindo histórico de uploads...");

const [uploadResult1] = await connection.query(`
  INSERT INTO uploads (userId, apiProvider, fileName, fileUrl, status, result, createdAt)
  VALUES (?, 'asaas', 'clientes_janeiro_2025.csv', 'https://storage.example.com/uploads/1234_clientes_janeiro.csv', 'success', '{"processedRows": 45, "errors": []}', DATE_SUB(NOW(), INTERVAL 5 DAY))
`, [userId]);
const upload1Id = uploadResult1.insertId;

const [uploadResult2] = await connection.query(`
  INSERT INTO uploads (userId, apiProvider, fileName, fileUrl, status, result, createdAt)
  VALUES (?, 'cobrefacil', 'cobrancas_fevereiro.xlsx', 'https://storage.example.com/uploads/5678_cobrancas_fev.xlsx', 'success', '{"processedRows": 32, "errors": []}', DATE_SUB(NOW(), INTERVAL 3 DAY))
`, [userId]);
const upload2Id = uploadResult2.insertId;

const [uploadResult3] = await connection.query(`
  INSERT INTO uploads (userId, apiProvider, fileName, fileUrl, status, result, createdAt)
  VALUES (?, 'asaas', 'boletos_urgentes.csv', 'https://storage.example.com/uploads/9012_urgentes.csv', 'error', '{"processedRows": 0, "errors": ["Erro na linha 5: formato inválido", "Erro na linha 12: campo obrigatório ausente"]}', DATE_SUB(NOW(), INTERVAL 1 DAY))
`, [userId]);
const upload3Id = uploadResult3.insertId;

const [uploadResult4] = await connection.query(`
  INSERT INTO uploads (userId, apiProvider, fileName, fileUrl, status, result, createdAt)
  VALUES (?, 'cobrefacil', 'clientes_novos.csv', 'https://storage.example.com/uploads/3456_novos.csv', 'success', '{"processedRows": 28, "errors": []}', NOW())
`, [userId]);
const upload4Id = uploadResult4.insertId;

console.log(`✅ Uploads criados com IDs: ${upload1Id}, ${upload2Id}, ${upload3Id}, ${upload4Id}`);

// 3. Inserir boletos vinculados aos uploads
console.log("🧾 Inserindo boletos mock vinculados aos uploads...");

const boletos = [
  // Boletos do upload 1 (asaas - 5 dias atrás) - 4 boletos
  {
    userId,
    uploadId: upload1Id,
    nossoNumero: "2025001",
    apiProvider: "asaas",
    externalId: "ASAAS-1736700000001",
    customerName: "João Silva Comércio LTDA",
    customerEmail: "joao.silva@empresa.com",
    customerDocument: "12.345.678/0001-90",
    value: 150000,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: "pending",
    boletoUrl: "https://mock-boleto.com/ASAAS-1736700000001",
    barcode: "34191234567890123456789012345678901234567890",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    uploadId: upload1Id,
    nossoNumero: "2025002",
    apiProvider: "asaas",
    externalId: "ASAAS-1736700000002",
    customerName: "Pedro Oliveira ME",
    customerEmail: "pedro@oliveira.com",
    customerDocument: "123.456.789-00",
    value: 89900,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "pending",
    boletoUrl: "https://mock-boleto.com/ASAAS-1736700000002",
    barcode: "34191234567890123456789012345678901234567891",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    uploadId: upload1Id,
    nossoNumero: "2025003",
    apiProvider: "asaas",
    externalId: "ASAAS-1736700000003",
    customerName: "Carlos Mendes Transportes",
    customerEmail: "carlos@transportes.com.br",
    customerDocument: "55.666.777/0001-88",
    value: 180000,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "paid",
    boletoUrl: "https://mock-boleto.com/ASAAS-1736700000003",
    barcode: "34191234567890123456789012345678901234567892",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    uploadId: upload1Id,
    nossoNumero: "2025004",
    apiProvider: "asaas",
    externalId: "ASAAS-1736700000004",
    customerName: "Patricia Souza Design",
    customerEmail: "patricia@design.com.br",
    customerDocument: "66.777.888/0001-99",
    value: 340000,
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    status: "pending",
    boletoUrl: "https://mock-boleto.com/ASAAS-1736700000004",
    barcode: "34191234567890123456789012345678901234567893",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },

  // Boletos do upload 2 (cobrefacil - 3 dias atrás) - 3 boletos
  {
    userId,
    uploadId: upload2Id,
    nossoNumero: "2025005",
    apiProvider: "cobrefacil",
    externalId: "COBREFACIL-1736700000005",
    customerName: "Maria Santos Consultoria",
    customerEmail: "maria@consultoria.com.br",
    customerDocument: "98.765.432/0001-10",
    value: 250000,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    status: "pending",
    boletoUrl: "https://mock-boleto.com/COBREFACIL-1736700000005",
    barcode: "34191234567890123456789012345678901234567894",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    uploadId: upload2Id,
    nossoNumero: "2025006",
    apiProvider: "cobrefacil",
    externalId: "COBREFACIL-1736700000006",
    customerName: "Ana Costa Serviços",
    customerEmail: "ana.costa@servicos.com",
    customerDocument: "11.222.333/0001-44",
    value: 320000,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: "paid",
    boletoUrl: "https://mock-boleto.com/COBREFACIL-1736700000006",
    barcode: "34191234567890123456789012345678901234567895",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    userId,
    uploadId: upload2Id,
    nossoNumero: "2025007",
    apiProvider: "cobrefacil",
    externalId: "COBREFACIL-1736700000007",
    customerName: "Roberto Alves Construções",
    customerEmail: "roberto@construcoes.com.br",
    customerDocument: "33.444.555/0001-22",
    value: 275000,
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: "overdue",
    boletoUrl: "https://mock-boleto.com/COBREFACIL-1736700000007",
    barcode: "34191234567890123456789012345678901234567896",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },

  // Boletos do upload 4 (cobrefacil - hoje) - 3 boletos
  {
    userId,
    uploadId: upload4Id,
    nossoNumero: "2025008",
    apiProvider: "cobrefacil",
    externalId: "COBREFACIL-1736700000008",
    customerName: "Lucas Pereira Informática",
    customerEmail: "lucas@informatica.com",
    customerDocument: "44.555.666/0001-77",
    value: 95000,
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "pending",
    boletoUrl: "https://mock-boleto.com/COBREFACIL-1736700000008",
    barcode: "34191234567890123456789012345678901234567897",
    createdAt: new Date(),
  },
  {
    userId,
    uploadId: upload4Id,
    nossoNumero: "2025009",
    apiProvider: "cobrefacil",
    externalId: "COBREFACIL-1736700000009",
    customerName: "Fernanda Lima Advocacia",
    customerEmail: "fernanda@advocacia.com",
    customerDocument: "99.888.777/0001-66",
    value: 450000,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "cancelled",
    boletoUrl: "https://mock-boleto.com/COBREFACIL-1736700000009",
    barcode: "34191234567890123456789012345678901234567898",
    createdAt: new Date(),
  },
  {
    userId,
    uploadId: upload4Id,
    nossoNumero: "2025010",
    apiProvider: "cobrefacil",
    externalId: "COBREFACIL-1736700000010",
    customerName: "Juliana Ferreira Contabilidade",
    customerEmail: "juliana@contabilidade.com",
    customerDocument: "22.333.444/0001-55",
    value: 120000,
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: "overdue",
    boletoUrl: "https://mock-boleto.com/COBREFACIL-1736700000010",
    barcode: "34191234567890123456789012345678901234567899",
    createdAt: new Date(),
  },
];

for (const boleto of boletos) {
  await connection.query(`
    INSERT INTO boletos (
      userId, uploadId, nossoNumero, apiProvider, externalId, customerName, customerEmail, 
      customerDocument, value, dueDate, status, boletoUrl, barcode, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `, [
    boleto.userId,
    boleto.uploadId,
    boleto.nossoNumero,
    boleto.apiProvider,
    boleto.externalId,
    boleto.customerName,
    boleto.customerEmail,
    boleto.customerDocument,
    boleto.value,
    boleto.dueDate,
    boleto.status,
    boleto.boletoUrl,
    boleto.barcode,
    boleto.createdAt,
  ]);
}

console.log("✅ Seed concluído com sucesso!");
console.log(`
📊 Resumo dos dados inseridos:
- 2 configurações de API (Asaas e Cobre Fácil)
- 4 uploads:
  • Upload 1 (Asaas - 5 dias atrás): 4 boletos
  • Upload 2 (Cobre Fácil - 3 dias atrás): 3 boletos
  • Upload 3 (Asaas - 1 dia atrás): 0 boletos (erro)
  • Upload 4 (Cobre Fácil - hoje): 3 boletos
- 10 boletos vinculados aos uploads:
  • 3 pendentes
  • 2 pagos
  • 1 cancelado
  • 2 vencidos
  • 2 pendentes adicionais

🚀 Acesse o sistema e clique nos uploads para ver os detalhes!
`);

await connection.end();
