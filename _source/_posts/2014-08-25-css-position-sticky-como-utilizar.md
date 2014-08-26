---
layout: post
title:  "CSS Position Sticky - Como utilizar?"
date:   2014-08-25 21:00:00
categories: css
author: luiztiago
image:
  feature: posts/luiztiago/sticky.jpg
related:
  - title: "CSS position"
    url: https://developer.mozilla.org/en-US/docs/Web/CSS/position
    from: MDN
  - title: "CSS Position"
    url: http://dev.w3.org/csswg/css-position/#sticky-positioning
    from: w3.org
  - title: "CSS position: sticky – Introduction and Polyfills"
    url: http://www.sitepoint.com/css-position-sticky-introduction-polyfills/?utm_source=CSS-Weekly&utm_campaign=Issue-124&utm_medium=email
    from: Sitepoint
comments: true
description: "Estamos passando por mais uma tendência no nosso mercado de desenvolvimento. Assim como na área de moda/design (e como os leigos comparam os estudantes de Webdesign), também vivemos num mundo de tendências, e atualmente é difícil encontrar um site ou sistema recente que não use alguns destes conceitos. Entre eles, permanecer com a navegação visível em toda a aplicação."
---

Estamos passando por mais uma tendência no nosso mercado de desenvolvimento. Assim como na área de moda/design (e como os leigos comparam os estudantes de Webdesign), também vivemos num mundo de tendências, e atualmente é difícil encontrar um site ou sistema recente que não use alguns destes conceitos. Entre eles, permanecer com a navegação visível em toda a aplicação.

Nos últimos anos, diversas soluções baseadas em Javascript foram criadas e agora podemos ver uma luz no fim do túnel, pois será possível utilizar apenas CSS para resolver este problema. Palmas!

Neste artigo iremos discutir sobre o `position: sticky`, a nova solução CSS para este problema. 

## Qual o problema atual?

Todos nós já usamos propriedades bem incríveis, tais como: `position: fixed`, mas a tendência não é essa. A ideia é que quando o usuário rolar a página, em vez do menu sumir, ele vai ficar na posição fixed apenas quando atingir o topo da *viewport*. Como nosso público acessa muito por smartphones/tablets, isso vai ajudar a acessar coisas importantes como a busca, menu ou o link para voltar para a Home.

Para conseguir isso, atualmente precisamos utilizar Javascript. Não quer dizer que isto seja ruim, mas na verdade, não deveríamos precisar utilizá-lo para algo tão simples, não é? E o pior é utilizarmos um eventListener para a rolagem da página, e alterar a posição do menu de acordo com a posição atual da janela. Especificamente, precisaríamos adicionar `top: 0` e `position: fixed` para o menu quando encostar no topo da *viewport*, e inverter, quando voltar para o início da página.

{% highlight js %}
var menu = document.querySelector('.menu')
var menuPosition = menu.getBoundingClientRect().top;
window.addEventListener('scroll', function() {
    if (window.pageYOffset >= menuPosition) {
        menu.style.position = 'fixed';
        menu.style.top = '0px';
    } else {
        menu.style.position = 'static';
        menu.style.top = '';
    }
});
{% endhighlight %}

Para melhorar 10 centavos da situação, criaríamos uma classe no CSS com estes valores, e faríamos a manipulação desta classe, mas mesmo assim precisaríamos usar JavaScript, como este exemplo abaixo, clar, usando VanillaJS:

{% highlight js %}
var menu = document.querySelector('.menu')
var menuPosition = menu.getBoundingClientRect().top;
window.addEventListener('scroll', function() {
    if (window.pageYOffset >= menuPosition) {
        menu.classList.add('menu-fixed');
    } else {
        menu.classList.remove('menu-fixed');
    }
});
{% endhighlight %}

## E o sticky?

Inicialmente, vamos usar como literatura a própria documentação da W3C:

*The box position is calculated according to the normal flow (this is called the position in normal flow). Then the box is offset relative to its flow root and containing block and in all cases, including table elements, does not affect the position of any following boxes. When a box B is stickily positioned, the position of the following box is calculated as though B were not offset. The effect of ‘position: sticky’ on table elements is the same as for ‘position: relative’.*

Podemos dizer que o `position: sticky` é um posicionamento híbrido entre `position: relative` e `position: fixed`. O elemento é tratado como `relative` até que cruza um limite especificado, e neste ponto ele é tratado como `fixed`. Por exemplo:

{% highlight css %}
#one {
  position: sticky; 
  top: 10px;
}
{% endhighlight %}

Ele ficará como relativo desde que o elemento rolar na viewport até ficar com menos que 10px do topo. Então, ele vai interpretar como sendo `position: fixed` com `top: 10px` desde que a viewport seja *scrollada* até passar este valor.

Parece confuso mas é bem mais simples do que parece. Isto já é usado em alguns lugares, como no índice alfabético de alguns smartphones, como por exemplo iOS e Android, onde o aparece no cabeçalho a letra "A" desde que o primeiro registro visível inicie com a letra "A". Quando o primeiro item visível começar com "B", este cabeçalho vai se tornar o título do "B", até que o primeiro inicie com "C" e assim sucessivamente.

- [Link para demo](http://jsfiddle.net/daker/ecpTw/light/), from [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/position).

<iframe width="100%" height="300" src="http://jsfiddle.net/daker/ecpTw/embedded/result,html,css,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Suporte e Polyfills

O suporte para isto ainda é bem fraco. Para verificar os detalhes, pode verificar a propriedade no [caniuse](http://caniuse.com/#feat=css-sticky) ou na lista resumida abaixo:

- **Firefox 26+** Suportado desde que altere o valor de `css.sticky.enabled` para `true` em  [about:config](about:config).
- **Chrome 23+** Suportado habilitando a flag `experimental Web Platform features` em [chrome://flags](chrome://flags).
- **Safari 6.1+** Suportado usando o prefixo -webkit no valor `-webkit-sticky`
- **Internet Explorer* HAHAHAHAHAHAHAH, poderia ser diferente? No support! Vê o [link no "Modern.IE"](http://status.modern.ie/positionsticky) e chora!

Quanto aos polyfills, podemos escolher entre alguns já criados:

* [fixed-sticky](https://github.com/filamentgroup/fixed-sticky) by the Filament Group (requires jQuery)
* [position–sticky-](https://github.com/matthewp/position--sticky-) by Matthew Phillips (Uses Modernizr for detection)
* [position: sticky](http://philipwalton.github.io/polyfill/demos/position-sticky/), part of Philip Walton’s Polyfill.js library
* [position: sticky CodePen demo](http://codepen.io/FWeinb/pen/xLakC) by Fabrice Weinberg (requires jQuery)
* [Stickyfill](http://wd.dizaina.net/en/scripts/stickyfill/) by Oleg Korsunsky (IE9+)