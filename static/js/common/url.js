/**
 * 处理url的一些函数
 */

define(['js/common/utils'], function(utils) {
    function getQuery(url) {
        var queryString = url.split('?')[1];
        var ret = {};
        utils.forEach(queryString.split('&'), function(query) {
            var querySplit = query.split('=');
            return this[querySplit[0]] = querySplit[1];
        }, ret);
        return ret;
    }

    return {
        getQuery: getQuery
    };
});