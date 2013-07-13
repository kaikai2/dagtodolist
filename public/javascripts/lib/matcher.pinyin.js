define(function(require, exports, module) {
    var _ = require('underscore')
    , pinyin = require('pinyin');
    
    var convertMap = {
        '(': '\\(',
        ')': '\\)',
        '.': '\\.',
        '*': '\\*',
        '+': '\\+',
        '[': '\\[',
        ']': '\\]',
        '?': '\\?',
        '\\': '\\\\',
    };
    function convert(c){
        if (c in convertMap){
            return convertMap[c];
        }
        return c;
    }
    function match(candidateList, queryString){
        /* '大哥去tmd干活'
        var candidateList = [
            ['大','da','dai'],
            ['哥','ge'],
            ['去','qu'],
            ['tmd'],
            ['干','gan'],
            ['活','huo'],
         ];
        queryString = 'qug活';
        */
        var res = [];
        for (var i = 0, li = candidateList.length; i < li; i++){
            var candidate = candidateList[i];
            for (var j = 0, lj = candidate.length; j < lj; j++){
                var c = candidate[j];
                if (c.length > 1){
                    var cA = c.split('');
                    for (var k = 0, lk = cA.length; k < lk; k++){
                        cA[k] = convert(cA[k]);
                    }
                    candidate[j] = cA[0] + cA.slice(1).join('?') + '?';
                }else{
                    candidate[j] = convert(c);
                }
            }
            res.push(candidate.join('|'));
        }
        var s = '^(' + res.join(')?(') + ')?$';
        var re = new RegExp(s, 'i');
        return re.test(queryString);//.match(re);
    }

    exports.candidateList = function(item){
        var all = _.map(item, function(c){
            var full = pinyin(c, {
                heteronym: true, // 开启多音字模式
                style: pinyin.STYLE_NORMAL,
            });
            return _.union(full[0], [c]);
        });
        return all;
    };
    exports.match = function(item, query){
        var candidateList = exports.candidateList(item);
        return match(candidateList, query);
    };
    
});
