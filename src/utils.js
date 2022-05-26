export default {
    firstToUpper: (s) => {
        return s.substring(0,1).toUpperCase()+s.substring(1);
    },
    firstToLower: (s) => {
        return s.substring(0,1).toLowerCase()+s.substring(1);
    },
    makePlural(name) {
        if (name.charAt(name.length-1)=="s")
            return name;
        return name+"s";
    },
    makeSingular(name) {
        if (name.charAt(name.length-1)=="s")
            return name.substring(0,name.length-1);
        return name;
    },
    checkEmptyString(s) {
        if (s instanceof String)
            return s=="";
        return false;
    }
}