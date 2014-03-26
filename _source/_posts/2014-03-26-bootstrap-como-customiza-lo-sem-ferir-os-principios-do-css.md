---
layout: post
title:  "Bootstrap: como customizá-lo sem ferir os princípios do CSS"
date:   2014-03-26 09:00:00
categories: css
author: luiztiago
image:
  feature: posts/luiztiago/bootstrap.png
related:
  - title: "Bootstrap"
    url: http://getbootstrap.com
    from: Twitter
  - title: "Bootstrap Customize"
    url: http://getbootstrap.com/customize
    from: Twitter
comments: true
description: "Bootstrap: Ele chegou e salvou a vida de muitos dev's, principalmente os que nunca foram tão atenciosos com interfaces. Com pouco tempo, nós passamos a vê-lo em todos os sites e aplicações que podemos imaginar. E pra se tornar um pouco diferente do mundo, vem as customizações que nem sempre são feitas da melhor forma."
---

Hey guys! Acredito que todos nós, desenvolvedores, passamos por isso. Às vezes nos bate um pouco de angústia quando vemos alguma coisa que parece ser tão lógica deixar de ser feita em alguns projetos. Depois que o sangue esfria, surge a ideia de ajudar um pouco o mundo dos devs, transformando algumas dicas de como não seguir o caminho das trevas, em um simples post.

Hoje tirei pra falar do Bootstrap. O Bootstrap é um dos casos que atualmente vem sofrendo um pouco com isso. Ele chegou e salvou a vida de muitos dev's, principalmente os que nunca foram tão atenciosos com interfaces. Com pouco tempo, nós passamos a vê-lo em todos os sites e aplicações que podemos imaginar. E pra se tornar um pouco diferente do mundo, vem as customizações que nem sempre são feitas da melhor forma.

Depois de ver algumas coisas rotineiras acontecendo em alguns projetos, decidi materializar essas dicas, baseadas em minha opinião, e tentar ajudar um pouco nosso mundo. Sintam-se à vontade pra acrescentar algo, sugerir, criticar ou qualquer outra coisa.

## Leia a documentação

O projeto do Bootstrap é magnífico. E algumas dicas fundamentais, estão escritas na documentação. Se você vai trabalhar com [Less](http://getbootstrap.com/css/#less), com [Sass](http://getbootstrap.com/css/#sass), ou se prefere [customizar direto no site do próprio Bootstrap](http://getbootstrap.com/customize/). Independente de qual caminho seguir, a documentação vai lhe dar o rumo certo.

Particularmente, não gosto muito de gerar o arquivo customizado direto do site. Com isso, as suas mudanças vão vir junto com todas as regras do tema, e podem dificultar quando for preciso atualizar o framework. O arquivo `bootstrap-theme.css` gerado pode não ser mais 100% compatível, e caso isso aconteça, será preciso atualizá-lo também e as regras de sua customização serão dificilmente lembradas.

## Não altere o arquivo do framework

Isto é geral. Nunca deve-se alterar o arquivo de uma biblioteca/framework/plugin ou qualquer coisa que seja. Você terá uma enorme dor de cabeça quando for fazer alguma atualização, ou saber qual versão você está trabalhando. E aquilo ali não foi feito para ser alterado, concorda?

**"Ah, mas eu queria alterar algumas coisas. Como faço?"**

Crie um arquivo a parte e defina suas regras com o mesmo conceito de override que você deve ter aprendido quando começou a programar.

{% highlight css %}
<link href="assets/css/bootstrap/bootstrap.min.css" type="text/css" rel="stylesheet" />
<link href="assets/css/main.css" type="text/css" rel="stylesheet" />
{% endhighlight %}

**Ex.: Quero alterar o *background-color* da `table-striped` do Bootstrap.**

Simplesmente inspeciona o elemento para ver qual seletor está sendo usado para tal definição que você quer mudar. Com isso, você repete o seletor e define apenas as regras que você precisa alterar no seu arquivo de customização, que no caso o escolhido foi o `main.css`.

{% highlight css %}
.table-striped>tbody>tr:nth-child(odd)>td,
.table-striped>tbody>tr:nth-child(odd)>th {
  background-color: #ccc;
}
{% endhighlight %}

Lembre-se: você não deve usar `!important` também. Isto não tema absolutamente **nenhuma** necessidade! **Nunca!**

Se o arquivo do seu "override" está sendo declarado depois e você está usando o mesmo seletor para definição das regras, as regras que forem definidas no seu arquivo `main.css` terão prioridade sob as definidas pelo Bootstrap. Caso tenha alguma dúvida de como isso funciona, sugiro procurar por algum artigo que fale sobre cálculo de especificidade.

## Evite usar classes que marcam valores/posições

Apesar da idade, eu participei um pouco da era das cavernas no desenvolvimento. Trabalhei com frames, tabelas, até surgir o tão sonhado termo *tableless* que nos fazia desenvolver sem usar as tão odiadas tabelas, e em paralelo, os nossos tão sonhados arquivos de estilo (CSS).

Mas por que fiz questão de voltar no tempo? Uma das coisas tão agraciadas com o surgimento das folhas de estilo, era concentrar as regras de formatação no arquivo CSS. E quando precisar alterar qualquer formatação, apenas estes arquivos precisavam ser alterados, e a mágica estaria feita.

Se for utilizado, principalmente de maneira repetida, classes como `pull-left` para `float:left`, `text-center` para `text-align: center`, `col-sm-offset-2` para um simples espaçamento, qualquer alteração no layout do projeto, pode lhe custar muito caro.

Imagine que todo título da página interna de um simples site possui a classe `text-center` para centralizá-lo. Um belo dia, o cliente ou o designer pedem para alinhá-lo do lado esquerdo. Qual a solução?

* Remover o text-center em todos os arquivos?
* Alterar o CSS para que a classe `text-center` seja agora `text-align: left`?
* Sentar e chorar?

Neste caso, no arquivo de customização, deveria ter apenas uma simples regra como exemplificado abaixo. E este arquivo seria o único alterado para uma mudança como essa, tão besta.

{% highlight css %}
section h2 {
  text-align: center;
}
{% endhighlight %}

Não é porque o bootstrap cria uma classe e um mixin para `text-center` que você não pode usar os princípios básicos de CSS em seu projeto. Uma escolha como essa pode lhe custar bem caro.

## Pesquisa

Isto nunca é demais. Aprender com erros é bem comum. Mas nós não precisamos errar para aprender, podemos também aprender com o erro dos outros. Não custa pesquisar, ver como os grandes projetos funcionam, ou até mesmo perguntar em qualquer grupo ou lista de discussão do tema. Com certeza alguém já teve um problema como o que você está tendo, ou pode ter.