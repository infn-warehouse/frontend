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