---
layout: post
title:  "Como configurar um servidor node.js para produção"
date:   2014-01-16 20:00:00
categories: javascript, node
author: djalmaaraujo
image:
  feature: posts/djalmaaraujo/ubuntu-setup.png
related:
  - title: "Site Oficial"
    url: http://nodejs.org/
    from: Node JS
  - title: "Forever Github Repository"
    url: https://github.com/nodejitsu/forever
    from: Forever
  - title: "Git SCM"
    url: http://git-scm.com/
    from: Git
  - title: "How to setup a node.js Web Server on Amazon EC2"
    url: http://www.lauradhamilton.com/how-to-set-up-a-nodejs-web-server-on-amazon-ec2
    from: "How to setup a node.js Web Server on Amazon EC2"
comments: true
description: "Você já precisou configurar ou sempre teve curiosidade de como configurar um servidor para rodar suas aplicações node js? Aprende como fazer deploy de sua aplicação com node js utilizando Forever."
---

Neste post, estou assumindo que você já possui sua VPS instalada e configurada com o Ubuntu Server. Optei pelo Ubuntu, por ser uma distribuição super simples de configurar. Caso você não possua, aqui vão algumas opções:

1. [Amazon EC2](http://aws.amazon.com/ec2/)
2. [Linode](http://www.linode.com/)
3. [WebbyNode](http://webbynode.com)
4. [Digital Ocean](http://www.digitalocean/)

Após o jabá gratuito, o primeiro passo, é você facilitar futuros acessos a máquina, guardando sua chave pública (~/.ssh/id_rsa.pub). Se você não sabe como gerar sua chave, [siga este tutorial](https://help.github.com/articles/generating-ssh-keys). O motivo deste procedimento é para você não precisar digitar sua senha toda as vezes que acessar a VPS.

## SSH key

Se você utiliza Mac, aqui vai uma dica super simples para copiar sua chave:

{% highlight bash %}
cat ~/.ssh/id_rsa.pub | pbcopy
{% endhighlight bash %}

Com este comando, sua chave já estará no seu clipboard para colar no servidor. Com sua chave em mãos, vamos nos conectar à vps e executar os seguintes comandos:

{% highlight bash %}

ssh usuario@ip-de-sua-vps # Ele vai solicitar sua senha desta vez.
cd ~/.ssh # Caso o diretório .ssh não exista, você deve criá-lo: mkdir ~/.ssh
vi authorized_keys

{% endhighlight bash %}

Caso o arquivo não exista, digite ```touch authorized_keys```. Em alguns casos você precisará utilizar ```sudo```. Então, ```sudo touch authorized_keys``` e ```sudo vi authorized_keys```.

Com o arquivo aberto no terminal, digite a tecla ```i``` para entrar em modo de edição no vi. Com o modo de edição ativado, cole sua chave que já deve estar no seu clipboard. (cmd + v para macs) e (control + v) para Windows/Linux. Com sua chave colada, aperte ```esc``` para voltar ao modo de leitura e em seguida ```x``` para salvar e fechar ao mesmo tempo.

Pronto, ssh key copiada! Caso você tenha criado o arquivo ```authorized_keys```, você vai precisar executar este comando para que o que fizemos tenha feito:

{% highlight bash %}
sudo chmod 444 ~/.ssh/authorized_keys
{% endhighlight bash %}

Esta forma de copiar a chave é bem manual, mas serve como aprendizado.

Outra forma muito útil de copiar sua chave é utilizando ```ssh-copy-id```. Se você utiliza Ubuntu por exemplo é só utilizar o comando. Se você é usuário Mac, você pode instalar através do ```brew install ssh-copy-id```. Para utilizar é muito simples:

{% highlight bash %}
ssh-copy-id user@hostname.example.com
{% endhighlight bash %}

Agora, da próxima vez que você acessar sua VPS ```ssh user@ip-de-sua-vps```, não haverá necessidade de digitar sua senha.

## Seguindo.. GIT!

Para nosso deploy, nós utilizaremos o GIT e o forever. Para isso, precisamos instalar o git na VPS. Para verificar se você já possui o git instalado, digite ```which git```. Se você receber a mensagem "git not found", vamos instalá-lo através do seguinte comando:

{% highlight bash %}
sudo apt-get install git
{% endhighlight bash %}

Provavelmente a instalação pedirá para você apertar ```Y``` para concordar em baixar os arquivos.

Com o GIT instalado, nos resta começar a brincar de instalar o NODE e logo menos, o forever para manter sua aplicação rodando em background. 

## Instalando o Node

Para instalar o node, vamos utilizar o apt-get, porém, os pacotes nem sempre estão atualizados como deveriam, então, para garantir que seja instalada a versão mais nova do node, vamos informar ao apt-get que desejamos um repositório específico para baixar o node:

{% highlight bash %}
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
{% endhighlight bash %}

Com o node instalado, vamos testar se funcionou digitando ```node --version```. Pronto, você já deve estar com o node instalado e consequentemente o npm, já que o mesmo vem "built-in" já faz algum tempo.

### Vamos ao exemplo! Finalmente, node!

Navegue até a pasta de seu usuário, Vamos clonar uma aplicação Express já existente para facilitar nosso trabalho.

{% highlight bash %}
cd ~
git clone https://github.com/djalmaaraujo/express-js-example-blog
cd express-js-example-blog
{% endhighlight bash %}

Se você tentar rodar ```node app.js```, você vai receber alguns erros, uma vez que precisamos instalar as dependências. Para isso, vamos utilizar o ```npm install``. Depois de algum tempo e muito output, o final se parecerá com isso:

{% highlight bash %}
...
...
express@3.4.7 node_modules/express
├── methods@0.1.0
├── merge-descriptors@0.0.1
├── cookie-signature@1.0.1
doctype html
├── range-parser@0.0.4
├── fresh@0.2.0
├── debug@0.7.4
├── buffer-crc32@0.2.1
├── cookie@0.1.0
├── mkdirp@0.3.5
├── send@0.1.4 (mime@1.2.11)
├── commander@1.3.2 (keypress@0.1.0)
└── connect@2.12.0 (uid2@0.0.3, pause@0.0.1, qs@0.6.6, bytes@0.2.1, raw-body@1.1.2, batch@0.5.0, negotiator@0.3.0, multiparty@2.2.0)
{% endhighlight bash %}

Pronto! Estamos prontos para rodar nossa primeira aplicação node em nossa VPS. Para isso, digite ```node app.js``` ou apenas ```node app```. Com isso você receberá a seguinte mensagem:

```Express server listening on port 3000```

Agora, você deve acessar sua VPS no browser, ```http://ip-de-sua-vps:3000```. Você verá a tela do express inicial:

{% highlight bash %}
Express
Welcome to Express
{% endhighlight bash %}

## E agora?

Perfeito! Agora nós temos nossa aplicação rodando e já podemos efetuar testes. Mas ninguém gosta de acessar sites na porta ```3000```, correto? Para configurar nossa porta ```80```, nós faremos mais algumas coisas.

Por padrão, o Ubuntu server vem com porta 80 bloqueada em seu firewall e além disso, para não ter necessidade de ficar "cascavilhando" e brigando com firewall e etc, vamos manter nossa aplicação rodando na porta ```3000``` e redirecionar a porta ```80```. Assim, quando os usuários acessarem seu app, a porta ```80``` será redirecionada para a porta ```3000``` em background.

```Não, seu browser não será redirecionado para :3000```

Para isso vamos primeiro checar se o "ip forwarding" está ativado na máquina. ```cat /proc/sys/net/ipv4/ip_forward``` vai te dizer se está ativado ou não. Caso você receba ```0```, para habilitar utilize as seguintes instruções:

{% highlight bash %}
sudo vi /etc/sysctl.conf
net.ipv4.ip_forward # Descomente esta linha no arquivo aberto. Salve e feche o arquivo.
sudo sysctl -p /etc/sysctl.conf # Para ativar as modificações feitas no arquivo.
cat /proc/sys/net/ipv4/ip_forward # Para verificar se agora está ativado.
{% endhighlight bash %}

Com o "port forwarding" ativado, agora vamos ativar nosso redirecionamento da porta ```80``` para a porta ```3000```, utilizando iptables.

{% highlight bash %}
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
{% endhighlight bash %}

Como dito acima, por padrão a porta ```80``` é bloqueada no firewall, então vamos permitir conexões através desta porta:

{% highlight bash %}
sudo iptables -A INPUT -p tcp -m tcp --sport 80 -j ACCEPT
sudo iptables -A OUTPUT -p tcp -m tcp --dport 80 -j ACCEPT
{% endhighlight bash %}

## Reiniciando a aplicação
Vá até sua aplicação, inicie a mesma ```node app```, e verifique agora no seu browser, que você pode acessar sua máquina através da porta ```80```. ```http://ip-de-sua-maquina```. O output da aplicação continuará dizendo ```listening on port 3000```, mas agora sua porta ```80``` está sendo redirecionada para a ```3000```.

## Mais um passo para a vitória. Colocando a aplicação para rodar em background com forever

Vamos começar instalado o forever, através do npm.

```[sudo] npm install forever -g```

Para utilizar o forever é extremamente simples, apenas saiba o path de sua aplicação e digite o seguinte comando:

```forever start /home/seuusuario/express-js-example-blog/app.js```

Com isso, você terá o seguinte output:

{% highlight bash %}
warn:    --minUptime not set. Defaulting to: 1000ms
warn:    --spinSleepTime not set. Your script will exit if it does not stay up for at least 1000ms
info:    Forever processing file: app.js
{% endhighlight bash %}

Você percebeu que agora, seu console ficou livre para efetuar outras operações. Isso acontece devido ao forever colocar o processo do node em background.

Aqui vão algumas dicas para você interagir mais com o forever:

* ```forever list``` Lista todas as suas aplicações iniciadas com o forever.
* ```tail -f /path/para/o/log/fornecido.log``` Você pode verificar o log de sua aplicação em tempo real.
* ```forever stopall``` Para todas as aplicações
* ```forever stop ID``` Para uma aplicação específica. Para conseguir o id, digite forever list.

Mais detalhes, acesse: [https://github.com/nodejitsu/forever](https://github.com/nodejitsu/forever)


## Up and running!
Seguindo todos estes passos, você terá sua VPS configurada para rodar suas aplicações node sem se preocupar em utilizar hosts de terceiros.

Existem diversas formas de se fazer setup de aplicações, e esta nem é a melhor, nem a pior, mas funciona. Se você estiver trabalhando em um projeto pequeno e que você não está preocupado em ter acesso root a máquina, eu recomendo fortemente que você utilize o [Heroku](http://heroku.com) para deploy de suas aplicações node/ruby/whatever.

Para o setup no heroku, você pode seguir este simples "Getting started": [https://devcenter.heroku.com/articles/getting-started-with-nodejs](https://devcenter.heroku.com/articles/getting-started-with-nodejs), mas isso é assunto para outro post.

Comentem, reclamem, corrijam! Até mais!
