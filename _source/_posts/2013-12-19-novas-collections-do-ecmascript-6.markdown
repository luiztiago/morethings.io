---
layout: post
title:  "Novas collections do EcmaScript 6"
date:   2013-12-19 10:00:00
categories: javascript
image:
  feature: the-future-is-here.jpg
  credit: gwire
  creditlink: http://www.flickr.com/photos/gwire/3397651143/
related:
  - title: "Simple Maps and Sets"
    url: http://wiki.ecmascript.org/doku.php?id=harmony:simple_maps_and_sets
    from: ES Wiki
  - title: "Global Objects Reference"
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
    from: Mozilla Developer Network
  - title: ECMAScript 6 collections, Part 1 Sets
    url: http://www.nczonline.net/blog/2012/09/25/ecmascript-6-collections-part-1-sets/
    from: NCZOnline
  - title: ECMAScript 6 collections, Part 2 Maps
    url: http://www.nczonline.net/blog/2012/10/09/ecmascript-6-collections-part-2-maps/
    from: NCZOnline
  - title: ECMAScript 6 collections, Part 3 WeakMaps
    url: http://www.nczonline.net/blog/2012/11/06/ecmascript-6-collections-part-3-weakmaps/
    from: NCZOnline
comments: true
description: "Na história do JavaScript, houve apenas um tipo de collection representado pelo Array. Com a especificação do ECMAScript 6, poderemos usar outras collections. Os novos tipos permitem o armazenamento melhor e mais eficiente de dados."
---

Para quem estava no [Front in Recife](http://frontinrecife.com.br), e acompanhou a minha palestra junto com [Guilherme Farias](http://github.com/guilhermefarias) ja teve um *spoiler* do post, visto que apresentamos la um pouco sobre as novas *collections*, bem como outras novidades do ECMAScript 6.

## O que são *collections*?

Em toda a história do JavaScript, houve apenas um tipo de *collection* representado pelo `Array`. Em outras linguagens como Python, Ruby e Java, já existem outras collections, e com a especificação do ECMAScript 6, também poderemos usá-las. Os novos tipos permitem o armazenamento melhor e mais eficiente de dados.

### Sets

*Sets* são listas ordenadas de valores que não permite valores duplicados. Normalmente você não acessa itens que foram setados, como normalmente fazemos com Arrays, ao invés disso, é mais comum verificar o conjunto para ver se um valor está presente.

Permite-se adicionar valores usando o método `add()` e verificar quantos itens estão no *set* usando `size()`.

{% highlight js %}

var items = new Set();

items.add(5);
items.add("5");
console.log(items.size()); // 2

items.add(5); // ja existe, sera ignorado
console.log(items.size()); // 2

{% endhighlight %}

Pode-se verificar se algum item está no *set* usando o método `has()`. Para remover algum valor, basta usar o método `remove()`.

{% highlight js %}

console.log(items.has(5)); // true

items.delete(5)
console.log(items.has(5)); // false

{% endhighlight %}

### Maps

É bem parecido com os *sets*, mas a ideia básica do map é que possui uma chave única, que você pode setar ou verificar a qualquer momento usando esta chave. Em JavaScript, os desenvolvedores tradicionalmente usam objetos regulares como Maps. Inclusive o próprio `JSON` é baseado neste conceito que representa pares de chave/valor.

{% highlight js %}

var map = new Map();
map.set("cor", "verde");

console.log(map.has("cor"));   // true
console.log(map.get("cor"));   // "verde"
console.log(map.size());       // 1

map.delete("cor");
console.log(map.has("cor"));   // false
console.log(map.get("cor"));   // undefined
console.log(map.size());       // 0

{% endhighlight %}

### WeakMaps

Bem parecido com os *maps*, os *weakmaps* também são baseados em chave/valor. Porém, a chave não pode ser um tipo primitivo (*String*, por exemplo). Ao invés disso, a chave deve ser um objeto. Isto pode parecer estranho, mas isto é bastante útil em algumas situações.

{% highlight js %}

var map = new WeakMap(),
    element = document.querySelector(".element");

map.set(element, "valor qualquer");

var value = map.get(element);
console.log(value); // "valor qualquer"

element.parentNode.removeChild(element);
element = null;

value = map.get(element);
console.log(value); // undefined

{% endhighlight %}