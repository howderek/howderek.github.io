/*var lovePoem = new window.Poem({
    lines: ['your $features warm my soul', 'you $whatYouDo', 'hold me close, kiss my $kissable'],
    features: ['bright green eyes', 'adorable faces', 'little laughs'],
    whatYouDo: ['keep me sane', 'fill me with ectasy', 'have my heart', 'capture my conscious'],
    kissable: ['lips', 'cheek', 'neck'],
    seperator: '<br>'
});

document.getElementById('poem').innerHTML = lovePoem.generate();*/

if (Date.now() > new Date('February 14, 2015').valueOf()) {
    document.body.removeChild(document.getElementById('notify'));
    document.getElementById('message').className = 'letter';
}