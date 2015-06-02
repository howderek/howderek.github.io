/***************************************
*               POEM.JS                *
*        (c) 2014 Derek Howard         *
*   a little javascript library that   *
*      can write poety like a boss     *
***************************************/

/*jslint browser:true debug:true*/
/*globals console*/

(function () {
    'use strict';
    //create a type of poem
    window.Poem = function (template) {
        this.template = template;
    };
    
    
    
    //returns an array of generated poems
    window.Poem.prototype.generate = function (many) {
        many = many || 1;
        var template = this.template,
            i = 0, 
            k = 0,
            reg = /\$([A-z]*)/g,
            poem = '',
            search = [],
            lines = [];
        
        for (i = 0; i < many; i += 1) {
            this.template.lines.forEach(function (line) {
                if (search = /\(([0-9]*)\)/g.exec(line)) {
                    line = line.replace(search[0], lines[search[1]]);
                }
                while (search = reg.exec(line)) {
                    line = line.replace(search[0], template[search[1]][(Math.floor(Math.random() * template[search[1]].length))]);
                }
                lines.push(line);
            });
        }
        
        poem = lines.join(template.seperator ? template.seperator : '<br>')
        return poem;
    };
    
}());