---
layout: post
title:  "Gulp JS: como se tornar Expert em minutos"
date:   2014-01-07 20:00:00
categories: javascript
image:
  feature: gulpjs.png
related:
  - title: "Site Oficial"
    url: http://gulpjs.com/
    from: Gulp JS
  - title: "And just like that Grunt and RequireJS are out, it’s all about Gulp and Browserify now"
    url: http://www.100percentjs.com/just-like-grunt-gulp-browserify-now/?utm_content=buffere74f0&utm_source=buffer&utm_medium=twitter&utm_campaign=Buffer
    from: 100PercentJS
  - title: README File
    url: https://github.com/gulpjs/gulp/blob/master/README.md#gulp---
    from: Github Gulp
  - title: Gulp - Slides from Eric Schoffstall
    url: http://slid.es/contra/gulp
    from: Eric Schoffstall
comments: true
description: "Gulp é um automatizador de tarefas escrito em JavaScript. Senti algumas vantagens interessantes, sendo mais simples e com menos configurações necessárias no código das `tasks`. O Gulp file também aparenta ter um entendimento mais fácil, e consequentemente mais rápido."
---

Pra começar bem o ano, já tivemos o anúncio do **Gulp JS**. Gulp é um automatizador de tarefas escrito em JavaScript. Ele é uma alternativa para o, atualmente mais popular, **GruntJS**. Automatizar tarefas não é uma novidade. Algumas figurinhas já são bem conhecidas, como o `ant` para Java, `rake` para Ruby, entre outras. Mas todas seguem com um grande objetivo em comum: minimizar trabalho repetitivo. E pra manter a qualidade dos nossos projetos, não podemos deixar de estudar as opções que temos.

Comparado com o Grunt, senti algumas vantagens interessantes, sendo mais simples e com menos configurações necessárias no código das `tasks`. O *Gulpfile* também aparenta ter um entendimento mais fácil, e consequentemente mais rápido.

E no dia 3 de Janeiro, já tivemos o seguinte anúncio no Twitter oficial:

![Twitter @gulpjs - We have now 100 plugins!](http://morethings.io/images/twitter-gulpjs-100-plugins.png)

A velocidade que está sendo feito os plugins é incrível. É um projeto muito recente e já tem muita contribuição da comunidade para conseguir avançar e nos ajudar cada vez mais em nossos projetos. Sem muito blá blá blá, vamos à pratica para ver sua simplicidade.

Como base, segue abaixo um simples **Gruntfile** (script para *Grunt*), usado para rodar as seguintes tarefas:

1. Rodar os testes
2. JSHint nos arquivos JavaScript
3. Concat nos arquivos JavaScript
4. Minificar os arquivos
5. Rodar novamente sempre que os arquivos forem alterados (watch)

{% highlight js %}
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
{% endhighlight %}

Segue abaixo um exemplo do **gulpfile.js**, similar ao Gruntfile acima, escrito para o **GulpJS** :)

{% highlight js %}
var gulp = require('gulp');
var pkg = require('./package.json');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var jshint = require('gulp-jshint');
var spawn = require('child_process').spawn;

var scriptFiles = './src/**/*.js';

gulp.task('compile', function(){
  // concat all scripts, minify, and output
  gulp.src(scriptFiles)
    .pipe(concat({fileName: pkg.name+".js"})
    .pipe(minify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function(){
  // lint our scripts
  gulp.src(scriptFiles).pipe(jshint());
{% endhighlight %}

## Quais as diferenças?

* Você utiliza o padrão do Gulp para fazer as tarefas básicas
* Plugins são simples e fazem apenas uma coisa. A maioria são apenas uma função com 20 linhas em média
* As tarefas são executadas de forma encadeada
* O código é bem menor e a curva de aprendizado também :)
* O Gulp não faz nada, apenas fornece um sistema básico de tarefas

## Learning...

Como aprender Grup? São 5 tarefas básicas que você precisa entender. São elas:

### gulp.task(name, fn)

Isto registra uma função com um nome.

Você pode opcionalmente especificar algumas dependências se outras tarefas precisam rodar antes.

### gulp.run(tasks...)

Roda todas as tarefas de forma encadeada

### gulp.watch(glob, fn)

Roda a função quando o arquivo tiver alterações

(*) Incluido no core para simplificar

### gulp.src(glob)

Os arquivos que serão lidos no fluxo, e inicia a emissão do arquivo correspondente, podendo ser usado em outros fluxos.

### gulp.dest(folder)

Isto irá retornar o resultado do fluxo, e será salvo no destino (similar ao writeFile() do FileSystem, para quem já está acostumado com Node).

Pois é. Estes são os 5 métodos padrões do Gulp. E todos eles são usados no código de exemplo acima para facilitar o entendimento.

## Parabéns!

Como a própria documentação diz, você agora tornou-se expert em Gulp! :)