---
layout: post
title:  "Como medir performance da sua aplicação usando User Timing API"
date:   2014-01-23 09:00:00
categories: javascript
author: luiztiago
image:
  feature: posts/luiztiago/user-timing-api.jpg
related:
  - title: "User Timing API Specification"
    url: http://www.w3.org/TR/user-timing/
    from: W3C
  - title: "Discovering the User Timing API"
    url: http://www.sitepoint.com/discovering-user-timing-api/
    from: sitepoint
  - title: "User Timing API - Understanding your Web App"
    url: http://www.html5rocks.com/en/tutorials/webperformance/usertiming/
    from: HTML5 Rocks
  - title: "Discovering the High Resolution Time API"
    url: http://www.sitepoint.com/discovering-the-high-resolution-time-api/
    from: sitepoint
  - title: "When milliseconds are not enough: performance.now()"
    url: http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now
    from: HTML5 Rocks
comments: true
description: "Se você deseja ter uma boa user experience em sua aplicação, é fundamental investir em performance. E para otimizá-la, você precisa ter números medidos e estes precisam ser bem precisos, para ajudar a encontrar os gargalos, fazer as melhorias e comparar os resultados. Mas como fazer estas medições com JavaScript?"
---

Se você deseja ter uma boa *user experience* em sua aplicação, é fundamental investir em performance. E para otimizá-la, você precisa ter números medidos e estes precisam ser bem precisos, para ajudar a encontrar os gargalos, fazer as melhorias e comparar os resultados. Mas como fazer estas medições com JavaScript?

Abaixo seguem duas formas, que são as mais conhecidas, onde os desenvolvedores já usam há algum tempo. E logo após, apresento como utilizar a User Timing API, que foi divulgada há pouco mais de um mês.

## Usando DOMTimeStamp com Date.now()

Durante muito tempo, os desenvolvedores usavam o `Date.now` para fazer estas medições. Abaixo podemos ver um exemplo comparando o tempo de execução de cada uma das funções `foo()` e `bar()`.

{% highlight js %}
var startTime = Date.now();
foo();
var test1 = Date.now();

bar();
var test2 = Date.now();

console.debug("Test1 time: " + (test1 - startTime));
console.debug("Test2 time: " + (test2 - test1));
{% endhighlight %}

O DOMTimeStamp retorna um número inteiro do tempo em milisegundos, que por sua vez, não possui muita precisão. E pra piorar, esta precisão varia entre os *user agents*, tornando-se não muito confiável.

## Usando DOMHighResTimeStamp com performance.now()

Afim de proporcionar uma maior precisão, um novo tipo chamado `DOMHighResTimeStamp` foi criado. O valor retornado também é em milissegundos, só que desta vez é um *float*, aumentando a precisão para um **milésimo de milésimo de segundo**. Como o [Paul Irish](https://twitter.com/paul_irish) mencionou "[When milliseconds are not enough](http://updates.html5rocks.com/2012/08/When-milliseconds-are-not-enough-performance-now)" num post com este título. O código abaixo mostra um exemplo bem semelhante com o acima, porém desta vez, um pouco mais preciso.

{% highlight js %}
var startTime = performance.now();
foo();
var test1 = performance.now();

bar();
var test2 = performance.now();

console.debug("Test1 time: " + (test1 - startTime));
console.debug("Test2 time: " + (test2 - test1));
{% endhighlight %}

Isto por um tempo pareceu bem interessante, mas bem trabalhoso quando você precisa fazer estes comparativos em objetos e métodos diferentes. Para isso, é necessário armazenar estes dados em variáveis globais e tudo isso atrapalha muito quando você está analisando performance, principalmente quando nem os milissegundos são tão precisos.

## User Timing API

E agora a música toca bem mais fácil. Com a chegada da *User Timing API*, tudo parece ficar bem mais simples do que atualmente. A API disponibiliza funções que podem ser chamadas por métodos em diferentes lugares em sua aplicação, para nos levar onde realmente estão os gargalos.

### Usando mark()

Este é o método principal em nosso toolkit. O `mark()` armazena o *timestamp* com a chave que foi passada. Pode-se executar o método em vários lugares da aplicação, registrando sempre o *timestamp* do momento em que foi executado. Inclusive, a especificação sugere uma série de nomes que podem ser interessantes e que são bem auto-explicativos, como `mark_fully_loaded`, `mark_fully_visible`, `mark_above_the_fold`.

Por exemplo, poderíamos definir uma *mark* para quando a aplicação for totalmente carregada usando:

{% highlight js %}
window.performance.mark('mark_fully_loaded');
{% endhighlight %}

Pode-se definir varias *marks* ao longo da aplicação, reunindo bons registros de tempo para analisar e descobrir o que e quando nossa aplicação está fazendo determinada coisa.

### Calculando medições com measure()

Depois de definir seus *marks*, você precisa medir o tempo decorrido entre eles. Para isso, existe o método `measure()`. Este método calcula o tempo decorrido entre as *marks*, e também pode medir o tempo entre seu *mark* e qualquer um dos nomes de eventos presentes na interface [`PerformanceTiming`](http://www.w3.org/TR/navigation-timing/#sec-navigation-timing-interface).

Por exemplo, você pode calcular o tempo entre DOM estar completo até o estado de sua aplicação estar 100% carregada, usando um código como este:

{% highlight js %}
window.performance.measure('measure_load_from_dom', 'domComplete', 'mark_fully_loaded');
// O domComplete é o evento já conhecido pela interface PerformanceTiming
{% endhighlight %}

Quando o `measure()` for executado, o resultado será armazenado independente das *marks* que forem setadas, para que possa ser analisado posteriormente. Isto permitirá que sua aplicação seja completamente executada, e só depois seja feita a análise dos dados.

### Descartando com clearMarks() e clearMeasures()

Algumas vezes pode ser necessário descartar *marks* que foram setadas e já foram medidas. Por exemplo, se fizer análise em algumas partes da ferramenta, e ao passar para outra parte, já não precise mais daquelas *marks*. Para isso, pode-se remover todas elas utilizando o `clearMarks()` sem parâmetros, ou definindo quais que deseja remover:

{% highlight js %}
window.peformance.clearMarks('mark_fully_loaded');
{% endhighlight %}

Da mesma forma, também existe o método `clearMeasures()`, só que desta vez para remover as medições (duh!).

{% highlight js %}
window.performance.clearMeasures('measure_load_from_dom');
{% endhighlight %}

Ambas utilizam as mesmas regras. Se não forem passados parâmetros, todas as medições serão removidas. Caso defina os parâmetros, apenas as que forem definidas serão removidas.

### A hora de fazer acontecer

Tudo que vimos até agora são as formas de coletar dados e fazer as medições. Agora precisamos coletar e analisar estes dados.

Com o método `getEntriesByTipe()`, permite-se obter todos os tempos das *marks* ou *measures*. Ele retornará uma lista em ordem cronológica, para ser visto na ordem em que os fatos aconteceram. Vejamos o código abaixo:

{% highlight js %}
var marks = window.performance.getEntriesByType('mark'),
    measures = window.performance.getEntriesByType('measure');
{% endhighlight %}

Também existe o método `getEntriesByName()` onde você pode usar o nome específico que foi setado na *mark* ou *measure*, como o código abaixo:

{% highlight js %}
var items = window.performance.getEntriesByName('mark_fully_loaded');
{% endhighlight %}

Isto retornará uma lista com um item (entry) contendo as seguintes propriedades:

* `name` que referencia o nome dado à *mark* ou *measure*;
* `entryType` que será uma String 'mark' ou 'measure';
* `startTime` o *timestamp* que foi iniciado;
* `duration` um *DOMHighResTimeStamp* com o tempo (se for uma *measure*). Caso seja uma *mark*, retornará valor 0.

### Mãos à obra!

Agora que já conhecemos bem a **User Interface API**, vamos a um exemplo contendo tudo o que vimos até então.

{% highlight js %}
performance.mark("startFoo");
foo();
performance.mark("endFoo");

// Cria uma measure "durationFoo" que irá medir o tempo entre as marks startFoo e endFoo
performance.measure("durationFoo", "startFoo", "endFoo");

// Remove todas as Marks
performance.clearMarks();
// Remove a measure "durationFoo"
performance.clearMeasure("durationFoo");
{% endhighlight %}

Desta mesma forma, diversos casos podem ser medidos, como alguma ou todas as XHR de sua aplicação, ou apenas algum método específico que deseja analisar.

Utilizar esta API não deve ser difícil para testar suas propriedades e métodos. Além disso, o suporte dos navegadores é muito bom. E para aqueles que não a suportam (principalmente o Firefox), um [polyfill já está disponível](https://gist.github.com/pmeenan/5902672). Então, mãos à obra!