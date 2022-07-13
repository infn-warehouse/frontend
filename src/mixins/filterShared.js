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
    this.load();

    for (let i=0;i<this.headersCount;i++) {
      if (!this.filterData[`columns${i}`]) {
        this.filterData[`columns${i}`]=[];
        this.filterInfo[`columns${i}`]=[];
        for (let item of this.headers) {
          let group='group' in item ? item.group : 0;
          if (i==group)
            this.filterData[`columns${i}`].push({
              name: this.$i18n.t(`headers.${this.tableName}.${item.value}`),
              value: item.value,
              checked: item.show!=1,
              default: item.show!=1,
              hidden: item.hidden
            });
        }
        this.filterInfo[`columns${i}`]={multiple: true};
        await this.loadConf(i);
      }
    }

    this.handleChange();
  },

  methods: {
    save() {
      this.setFilter({
        filterData: this.filterData,
        filterInfo: this.filterInfo
      });
    },
    async loadConf(i) {
      let res=await this.getPref(this.prefName+"_"+i);
      if (!res) return;
      
      let checkedCols=JSON.parse(atob(res));
      this.filterData[`columns${i}`].forEach((o) => {
        o.default=checkedCols.includes(o.value);
        o.checked=o.default;
      });
    },
    async saveConf(i) {
      let checkedCols=_.map(_.filter(this.filterData[`columns${i}`], (o) => o.checked),(o) => o.value);
      let res=await this.setPref(this.prefName+"_"+i,btoa(JSON.stringify(checkedCols)));
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

    handleSave(i) {
      this.saveConf(i);
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