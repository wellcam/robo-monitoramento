# robo-monitoramento
Monitoramento de fim de deploy


Esse roồ de monitoramente tem como objetivo verificar disponibilidade de sites.

Atualmente a mensagem de retorno está fixa, específicamente para o uso do meu cotidiano no trabalho. Saber se o ambiente de teste ou produção já está online novamente para uso, para que não haja um delay em saber se os testes já podem ser retomados.


Execução do projeto/docker:

1. docker build -t robo-check:v1.1 .
2. docker run -dp 3000:3000 --name robo-check robo-check:v1.1