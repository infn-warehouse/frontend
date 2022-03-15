import enums from "@/enums";
import _ from "lodash";

export default {
  mixins: [],

  computed: {
    enums() {
      return enums;
    }
  },

  data() {
    return {
      drawer: false,
    };
  },

  watch: {
    drawer(val) {
      this.$emit("drawerChanged", val);
    }
  },

  async created() {
    try {
      this.load();
      this.handleChange();
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    save() {
      this.setFilter(this.filterData);
    },
    load() {
      if (!this.flag) return false;
      this.setFlag(false);
      if (_.isEmpty(this.filter)) return false;
      this.filterData=this.filter;
      return true;
    },

    open() {
      this.drawer = true;
    },

    handleChange() {
      let filters = this.computeFilters(this.filterData,this.filterInfo);
      let clear = this.computeClear(filters);
      this.save();
      this.$emit("onChange",clear,filters);
    },

    clearFilters() {
      this.resetFilter(this.filterData,this.filterInfo);
      this.save();
      this.$emit("onChange",true,{});
    },

    computeFilters(filterData, filterInfo, matchAttribute = "value") {
      let filters={};
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
          }
        }
        else if (Array.isArray(data)) {
          if (info.multiple) {
            filter = [];
            data.forEach(function(item) {
              if (item.checked) {
                filter.push(item[matchAttribute]);
              }
            });
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
            });
          }
        }
        else {
          filter=data;
        }

        if (filter!=null && filter!="")
          filters[key]={
            type: info.type,
            value: filter
          };
      }
      return filters;
    },
    computeClear(filters) {
      let clear = true;
      for (var key in filters) {
        let val=filters[key];
        if (val!=null && val!="") {
          clear = false;
          break;
        }
      }
      return clear;
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
            element.checked = false;
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