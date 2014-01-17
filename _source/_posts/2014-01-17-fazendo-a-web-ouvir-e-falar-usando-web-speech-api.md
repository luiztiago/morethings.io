---
layout: post
title:  "Fazendo a Web ouvir e falar usando Web Speech API"
date:   2014-01-17 15:00:00
categories: javascript
author: luiztiago
image:
  feature: posts/luiztiago/web-speech-api.jpg
related:
  - title: "Web Speech API Specification"
    url: https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html
    from: W3C
  - title: "Voice Driven Web Apps: Introduction to the Web Speech API"
    url: http://updates.html5rocks.com/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API
    from: HTML5 Rocks
  - title: "Web apps that talk - Introduction to the Speech Synthesis API"
    url: http://updates.html5rocks.com/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API
    from: HTML5 Rocks
  - title: "Speech API Community Group"
    url: http://www.w3.org/community/speech-api/
    from: W3C Community and Business Groups
comments: true
description: "Neste post é abordada a Web Speech API com detalhes, utilizando as interfaces de Speech Synthesis e Voice Recognition."
---

A Web Speech API adiciona [voice recognition](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-section) (reconhecimento de voz, ou seja, voz para texto) e [speech synthesis](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#tts-section) (pronúncia de texto, ou seja, texto para voz). Neste post, iremos abordar as duas funcionalidades, mas com mais detalhes nesta última interface, por ser mais recente e já poder ser testada na última versão do [Google Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html).

## Speech Synthesis Interface

Para o uso mais básico da API, é mais fácil que tirar pirulito de criança. Olha só!

{% highlight js %}
var msg = new SpeechSynthesisUtterance('more things dot io');
window.speechSynthesis.speak(msg);
{% endhighlight %}

Entretanto, também pode alterar alguns parâmetros como volume, velocidade da fala, pitch, voz e idioma, como vemos à seguir:

{% highlight js %}
var msg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
msg.voice = voices[10]; // Obs: algumas vozes não dão suporte a alterar alguns parâmetros
msg.voiceURI = 'native';
msg.volume = 1; // 0 to 1
msg.rate = 1; // 0.1 to 10
msg.pitch = 2; //0 to 2
msg.text = 'Hello World';
msg.lang = 'en-US';

msg.onend = function(e) {
  console.log('Finished in ' + event.elapsedTime + ' seconds.');
};

speechSynthesis.speak(msg);
{% endhighlight %}

### Setando a voz

A API também possibilita termos uma lista das vozes que estão sendo suportadas.

{% highlight js %}
speechSynthesis.getVoices().forEach(function(voice) {
  console.log(voice.name, voice.default ? '(default)' :'');
});
{% endhighlight %}

Para setar uma voz diferente, basta setar no parâmetro `voice` do objeto instanciado, como vemos abaixo:

{% highlight js %}
var msg = new SpeechSynthesisUtterance('I see dead people!');
msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Whisper'; })[0];
speechSynthesis.speak(msg);
{% endhighlight %}

### Suporte dos browsers

Apenas o Chrome 33 (por enquanto, o Canary) tem o suporte completo a Web Speech API, enquanto o Safari do iOS7 tem suporte parcial. Mas isto não é nada demais, quando podemos usar *feature detection*, como vemos abaixo:

{% highlight js %}
if ('speechSynthesis' in window) {
 // Synthesis support. Make your web apps talk!
}

if ('SpeechRecognition' in window) {
  // Speech recognition support. Talk to your apps!
}
{% endhighlight %}

Para testar, baixe a versão mais recente do [Google Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html). Após instalá-lo, você pode testar através da demonstração criada pelo Eric Bidelman, chamada "[More Awesome Web: features you've always wanted](http://www.moreawesomeweb.com/demos/speech_translate.html)" apresentada na Google I/O 2013.

## Speech Recognition Interface

A **Web Speech API** possibilita adicionar bem facilmente reconhecimento de voz em suas páginas. Esta API possibilita um controle fino e flexível no reconhecimento de voz, e por já ter suas definições anteriormente que a *Speech Synthesis Interface*, já encontra-se disponível desde o Chrome versão 25+. Para entender melhor, iremos nos basear [nesta demonstração](http://www.moreawesomeweb.com/demos/speech_translate.html) apresentada na Google I/O 2013, que é bem interessante.

{% highlight js %}
var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;

recognition.onstart = function() { ... }
recognition.onresult = function(event) { ... }
recognition.onerror = function(event) { ... }
recognition.onend = function() { ... }
{% endhighlight %}

O valor padrão para `continuous` é false, o que significa que quando o usuário parar de falar, o reconhecimento de voz vai acabar. Isto é ótimo para textos curtos, mas na demonstração, deixamos como `true` para o reconhecimento continuar mesmo se o usuário fizer uma pausa enquanto fala.

O valor padrão para `interimResults` também é false, o que significa que apenas os resultados que forem retornados pelo "reconhecedor" são finais e não podem ser alterados.

Para iniciar, o usuário clica no microfone ao lado e é disparado o método `start()` instanciado no objeto `recognition`.

{% highlight js %}
function startButton(event) {
  recognition.lang = select_dialect.value;
  recognition.start();
}
{% endhighlight %}

Ao iniciar a captura de áudio, ele chama o handler `onstart`, e em seguida, para cada novo conjunto de palavras, ele chama o handler `onresult`.

{% highlight js %}
recognition.onresult = function(event) {
    var interim_transcript = '';

    for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
}
{% endhighlight %}

Este handler concatena todos os resultados recebidos em duas strings: `final_transcript` e `interim_transcript`. A primeira vai ser sempre todo o conteúdo transcrito, enquanto a última é esvaziada sempre que o handler é chamado.

Você pode fazer um teste através desta [demonstração criada pela equipe do Google Chrome](https://www.google.com/intl/en/chrome/demos/speech.html)

## Qual a dificuldade?

Pois é, muito simples não é? Isto acontece com quase todas as APIs que são lançadas. Um pouquinho de estudo já faz com que você se torne um bom conhecedor do assunto. Não esquece de dar seu feedback abaixo :)