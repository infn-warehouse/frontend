import moment from "moment";

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
    formatDate(date) {
        return moment(date).format("DD/MM/YYYY");
    },
    formatDateTime(date) {
        return moment(date).format("DD/MM/YYYY H:mm");
    },
    postgreDate(date) {
        return moment(date).format('YYYY-MM-DDTHH:mm:ss');
    },
    parseDate(str) {
        return moment(str).toDate();
    },
    extractId(idName,payload) {
        if (!Array.isArray(idName))
            idName=[idName];
        
        let id=[];
        idName.forEach(o => {
            id.push(payload[o])
        });

        for (let i=0;i<idName.length;i++)
            if (id[i]==null)
                return null;

        return id;
    },
    updateObject(obj,data) {
        for (let key in data)
          if (key in obj)
              obj[key]=data[key];
    }
}