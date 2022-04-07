import Vue from 'vue'
import voca from "voca";
import moment from "moment";
import i18n from "@/i18n";

Vue.filter("capitalize", value => voca.capitalize(value));
Vue.filter("trim", value => voca.trim(value));
Vue.filter("titleCase", value => voca.titleCase(value));
Vue.filter("upperCase", value => voca.upperCase(value));
Vue.filter("datetime", value => {
  if (value) {
    return moment(String(value)).format("YYYY/MM/DD HH:mm");
  }
});
Vue.filter("fullDateTime", value => {
  if (value) {
    moment.locale("it");
    return moment(String(value)).format("LLLL");
  }
});
Vue.filter("date", value => {
  if (value) {
    return moment(String(value)).format("DD/MM/YYYY");
  }
});
Vue.filter("month", value => {
  if (value) {
    return moment(String(value)).format("MM/YYYY");
  }
});
Vue.filter("size", value => {
  if (value>=1073741824)
    return (value/1073741824).toFixed(2)+" GB";
  if (value>=1048576)
    return (value/1048576).toFixed(2)+" MB";
  if (value>=1024)
    return (value/1024).toFixed(2)+" KB";
  return (value).toFixed(0)+" bytes";
});
Vue.filter("currency", value => {
  if (value) {
    return value.toFixed(2)+" €";
  }
});
Vue.filter("fullDate", value => {
  if (value) {
    moment.locale("it");
    return moment(String(value)).format("dddd, D MMMM YYYY");
  }
});
Vue.filter("yesNo", value => {
  if (value!=null) {
    if (value)
      return i18n.t("misc.yes");
    return i18n.t("misc.no");
  }
});