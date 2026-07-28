/* Leads vindos do site — protótipo com dados de exemplo, sem back-end.
   Quando existir a tabela `leads` no Supabase, esta tela lê de lá. */

const LEADS = [
  { quando: "Hoje, 09:14", nome: "Carla Meneses", contato: "(21) 98xxx-4471", imovel: "AP0757-MBNH", origem: "Formulário", novo: true },
  { quando: "Hoje, 08:02", nome: "Roberto Lins", contato: "(21) 99xxx-1180", imovel: "CA1042-MBNH", origem: "WhatsApp", novo: true },
  { quando: "Ontem, 19:47", nome: "Patrícia Sá", contato: "patricia@…", imovel: "AP0617-MBNH", origem: "Formulário", novo: false },
  { quando: "Ontem, 15:20", nome: "Anderson Vieira", contato: "(21) 97xxx-3352", imovel: "AP0904-MBNH", origem: "WhatsApp", novo: false },
  { quando: "Ontem, 11:05", nome: "Juliana Prado", contato: "juliana@…", imovel: "AP1140-MBNH", origem: "Formulário", novo: false },
];

export default function PainelLeads() {
  return (
    <>
      <div className="painel-cabecalho">
        <div>
          <h1>Leads</h1>
          <p>Quem preencheu formulário ou chamou no WhatsApp pelo site.</p>
        </div>
      </div>

      <div className="painel-aviso">
        <span>
          Esta tela cobre só os leads <strong>do site novo</strong>. O funil de
          atendimento completo continua no sistema atual — não é escopo desta
          substituição.
        </span>
      </div>

      <div className="painel-tabela-wrap">
        <table className="painel-tabela">
          <thead>
            <tr>
              <th>Quando</th>
              <th>Nome</th>
              <th>Contato</th>
              <th>Imóvel</th>
              <th>Origem</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {LEADS.map((l) => (
              <tr key={`${l.nome}-${l.quando}`}>
                <td className="num">{l.quando}</td>
                <td>
                  <strong>{l.nome}</strong>
                  {l.novo && <> <span className="etiqueta nova">novo</span></>}
                </td>
                <td className="num">{l.contato}</td>
                <td className="num">{l.imovel}</td>
                <td>{l.origem}</td>
                <td>
                  <button className="painel-btn contorno pequeno" type="button">Abrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
