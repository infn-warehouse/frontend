import enums from "@/enums";
import _ from "lodash";
import helper from "@/mixins/helper";
import utils from "../utils";

export default {
  mixins: [helper],

  computed: {
    enums() {
      return enums;
    },
    prefName() {
      return "filterPref_"+this.tableName;
    }
  },

  data() {
    return {
      drawer: false
    };
  },

  props: {
    headers: {
      required: false
    },
    tableName: {
      required: true
    },
  },

  watch: {
    drawer(val) {
      this.$emit("drawerChanged", val);
    }
  },

  async created() {
    try {
      this.load();

      if (!this.filterData.columns) {
        this.filterData.columns=[];
        for (let item of this.headers) {
          this.filterData.columns.push({
            name: this.$i18n.t(`headers.${this.tableName}.${item.value}`),
            value: item.value,
            checked: item.show!=1,
            default: item.show!=1,
            hidden: item.hidden
          });
        }
        this.filterInfo.columns={multiple: true};
        await this.loadConf();
      }

      this.handleChange();
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    save() {
      this.setFilter({
        filterData: this.filterData,
        filterInfo: this.filterInfo
      });
    },
    async loadConf() {
      let res=await this.getPref(this.prefName);
      if (!res) return;

      let checkedCols=JSON.parse(atob(res));
      this.filterData.columns.forEach((o) => {
        o.default=checkedCols.includes(o.value);
        o.checked=o.default;
      });
    },
    async saveConf() {
      let checkedCols=_.map(_.filter(this.filterData.columns, (o) => o.checked),(o) => o.value);
      let res=await this.setPref(this.prefName,btoa(JSON.stringify(checkedCols)));
    },

    load() {
      if (!this.flag) return false;
      this.setFlag(false);
      if (_.isEmpty(this.filter)) return false;
      this.filterData=this.filter.filterData;
      this.filterInfo=this.filter.filterInfo;
      return true;
    },

    open() {
      this.drawer = true;
    },

    close() {
      this.drawer = false;
    },

    handleChange() {
      let { filters, clear } = this.computeFilters(this.filterData,this.filterInfo);
      this.save();
      this.$emit("onChange",clear,filters);
    },

    handleSave() {
      this.saveConf();
    },

    clearFilters() {
      this.resetFilter(this.filterData,this.filterInfo);
      this.handleChange();
    },

    computeFilters(filterData, filterInfo, matchAttribute = "value") {
      let filters={};
      let clear=true;

      for (let key in filterData) {
        let data=filterData[key];
        let info=filterInfo[key];

        let filter;
        if (info.type=="range") {
          if (data.from && data.to) {
            filter={
              from: data.from,
              to: data.to
            };
            clear=false;
          }
        }
        else if (Array.isArray(data)) {
          if (info.multiple) {
            filter = [];
            let check=true;
            data.forEach(function(item) {
              if (item.checked) {
                filter.push(item[matchAttribute]);
              }
              else check=false;
              if (item.checked != (item.default ?? false))
                clear=false;
            });
            if (check && info.resetAll)
              filter=[];
          }
          else {
            filter = "";
            data.forEach(function(item) {
              if (item.checked) {
                if (typeof item.all === "undefined" || !item.all) {
                  filter = item[matchAttribute];
                } else {
                  filter = "";
                }
              }
              if (item.checked != (item.default ?? false))
                clear=false;
            });
          }
        }
        else if (data!=null && data!="") {
          filter=data;
          clear=false;
        }
        if (filter!=null && filter!=="") {
          filters[key]={
            type: info.type,
            value: filter
          };
        }
      }
      return { filters, clear };
    },
    resetFilter(filterData,filterInfo) {
      for (var key in filterData) {
        let data=filterData[key];
        let info=filterInfo[key];
        
        if (info.type=="range") {
          filterData[key]={};
        }
        else if (Array.isArray(data)) {
          let new_array = _.cloneDeep(data);
          new_array.forEach(function(element) {
            element.checked = element.default?element.default:false;
          });
          filterData[key]=new_array;
        }
        else {
          filterData[key]=null;
        }
      }
    },
  }
}