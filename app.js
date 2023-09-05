import express from 'express';
import fetch from 'node-fetch'; // Use node-fetch para fazer solicitações HTTP
const app = express();
const PORT = 3000;
const currentDate = new Date();

const options = {
  timeZone: 'America/Sao_Paulo',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};

app.get('/check-site', async (req, res) => {

  const url = req.query.website;
  const environment = req.query.environment
  const webhookURL = req.query.webhook
  const maxAttempts = 90; //Numero em minutos
  let attempts = 0;

  let currentDateStartServer = new Date();
  let timeServerNow = currentDateStartServer.toLocaleString('pt-BR', options);

  console.log('----------- Robô de verificação -- ' + timeServerNow + ' -\n');
  console.log('URL: ' + url + '\n')
  console.log('WEBHOOK: ' + webhookURL + '\n');

  if(url !== undefined && url !== null && url !== ''){

    async function checkSite() {
      try {
  
        const response = await fetch(url);
        if (response.status === 200) {
  
          let currentDateEndCheck = new Date();
          let timeNow = currentDateEndCheck.toLocaleString('pt-BR', options);
          let message = 'Fim do Deploy - Ambiente de ' + environment + ' está disponível. Início do monitoramento : ' + timeServerNow + ' - Fim do deploy: ' + timeNow;
  
          
          if (webhookURL !== undefined && webhookURL !== null && webhookURL !== ''){
            const teamsWebhookURL = webhookURL;
            const teamsMessage = {
              text: message,
            };
    
            await fetch(teamsWebhookURL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(teamsMessage),
            });
  
          }
  
          res.status(200).json({ message: message });
          console.log('----------- Verificação encerrada -----------\n');
          console.log('=============================================\n');
        } else {
          console.log(response.status)
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkSite, 90000);
          } else {
            errorHandler(environment, res)
          }
        }
  
  
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkSite, 90000);
        } else {
          errorHandler(environment, res)
        }
      }
    }
  
    checkSite();

  } else {
    let currentDateEndCheckError = new Date();
    let timeNow = currentDateEndCheckError.toLocaleString('pt-BR', options);
    let message = 'URL está vazia, não há o que verificar - ' + timeNow;
    res.status(200).json({ message: message });
    console.log('----------- Verificação encerrada -----------\n');
    console.log('=============================================\n');
  }
  
});

async function errorHandler(environment, res) {

  let currentDateEndCheckError = new Date();
  let timeNow = currentDateEndCheckError.toLocaleString('pt-BR', options);
  let message = '[ERROR] - Tempo do deploy em ' + environment + ' excedeu 1 hora e 30 desde o início do monitoramento - Algo de errado ocorreu. Início: ' + timeNow;

  console.log(message);
  console.log('----------- Verificação encerrada -----------');
  res.status(500).json({ message: message });

}

app.listen(PORT, () => {
  console.log(`========Servidor rodando na porta ${PORT} ========\n`);
  let timeServer = currentDate.toLocaleString('pt-BR', options);
  console.log('----------- Iniciado: ' + timeServer +  ' -----------\n');
});
