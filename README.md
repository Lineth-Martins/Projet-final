
## 🚀 Funcionalidades Principais
- **Criação de Pedidos**
  - 4 tipos diferentes
  - Validação de campos
- **Gestão de Pedidos**
  - Filtros por estado/tipo
  - Aprovação/rejeição
- **Visualização**
  - Tabela responsiva
  - Modal de detalhes

## 🛠 Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript (ES6)
- localStorage

## 🔧 Como Executar
1. Clone o repositório
2. Abra `index.html` no navegador
3. Utilize os dados de exemplo ou crie novos pedidos

## 📝 Modelo de Dados
Armazenado em formato JSON no localStorage:
```json
{
  "id": "PED-123456",
  "empresa": "Exemplo Ltda",
  "tipo": "Aquisicao de Materiais",
  "descricao": "Material de escritório",
  "valor": 150.50,
  "estado": "PENDING",
  "data": "2025-03-20T10:30:00Z"
}
