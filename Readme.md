# Teste Técnico Linx


## Arquitetura e decisões técnicas

### Banco de Dados:
---
Para esse projeto, estou utilizando o banco de dados _MongoDB_, pela sua versatilidade e estrutura, formato _BSON_, semelhante aos dados do arquivo _JSON_, formado dos dados fornecidos para API de Catálogo. Além disso, devido a não necessidade de queries complexas tornou-se outro motivo para a escolha do MongoDB. Também escolhi utilizar o driver _Mongoose_ que é uma ferramenta de modelagem de objetos MongoDB projetada para ambiente assíncrono e facilita a integração das aplicações Nodejs com o banco.

Quanto à modelagem, os dados fornecidos foram persitidos no mesmo Schema que estavam os objetos JSON, tendo como ids únicos os próprios ids.

</br>

### Organização do código
---

Para boas práticas de código e formatação, utilizei o pacote _ESLint_. Como estrutura de projeto busquei utilizar a estrutura de Database, Models, Controllers e routes para a API de Catálogo que garantiu uma boa separação das responsabilidades de cada módulo assim permitindo uma boa matutenção do código. Para a API de recomendações, utilizei uma estrutura similar, substituindo a camada de Database para de serviços devido a necessidade de comunicação com a API de Catálogo e os microserviços da Linx.

</br>

### Tecnologias utilizadas
---
- NodeJs e Express para as APIs
- Axios para requisições dos serviços na API de recomendações
- MongoDB
- Mongoose
- HTML e CSS


### Instruções para execução
---
Os comandos a seguir foram testados em uma máquina virtual, com o sistema operacional Ubuntu 20.04 Focal Fossa, a partir de uma instalação "limpa".

### **1. Instalação de dependências**
---

O primeiro passo é a instalação do Git. Para isso, usar o comando:

```
sudo apt install git -y
```

Instalação do curl:

```
sudo apt install curl -y
```

Agora, deve-se habilitar o repositório NodeSource com o comando:

```
sudo curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
```

Após isso, deve-se instalar o Node com o comando:

```
sudo apt-get install -y nodejs
```

Para verificar se o Node foi instalado corretamente, execute o comando (este projeto foi desenvolvido com a versão 12):

```
node --version
```

Agora instalaremos o MongoDB.
Primeiro vamos importar instalar a biblioteca gnupg
```
sudo apt-get install gnupg
```

Em seguida, importaremos a chave para o sistema de gerenciamento de pacotes

```
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
```

Agora criaremos um arquivo e lista para versão determianda.

Se você está usando o Ubuntu 20.04 (Focal)

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

Caso, use Ubuntu 18.04 (Bionic)

```
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
```

Agora atualizaremos os pacotes e então instalaremos o MongoDB

```
sudo apt-get update && sudo apt-get install -y mongodb-org
```

Finalmente, start o mongoDB

```
sudo systemctl start mongod
```

Para verificar se ele já está rodando, use o seguinte comando

```
sudo systemctl status mongod
```

<br>


### **2. Executando a API**
---

-   Primeiramente, é preciso clonar o repositório e apontar o terminal para a pasta do projeto:

```
git clone https://github.com/adhamlucas/teste-tecnico-linx.git
cd teste-tecnico-linx
```

-  Instalação dos pacotes Node utilizados pelo projeto:

```
cd api-recomendacoes
npm install
cd ..
cd api-catalogo
npm install
```


Agora executaremos os serviços, porém, antes precisamos executar o script para persistir os dados do catalog.json no mongodb. Ainda na pasta api-catalogo, execute:

```
npm run read-save
```

Terminado de exutar o script executaremos o serviço de Catalogo:
```
npm start
```

Em outro terminal (`ctrl + alt + t`) ou outra aba (`ctrl + shift + t`), executaremos o serviço de recomendações, então abrindo outra aba e estando na mesma pasta, execute:

```
cd ..
cd api-recomendacoes
npm start
```

<br>

### 3. Executando o frontend
---

Após estarmos com todos os serviços funcionando podemos utilizar o frontend. Para isso basta abrir o arquivo index.html que se encontra na pasta frontend do repositório.

<br>

### 4. Documentação
---

Para visualizar a documentação do projeto você pode abrir o arquivo html que se encontra na pasta documentations ou utilizar o seguinte link: https://app.swaggerhub.com/apis-docs/adhamoliveira/Linx/1.0.0 

<br>

### Autor: Adham Oliveira