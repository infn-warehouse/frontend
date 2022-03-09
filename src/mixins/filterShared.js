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
      this.resetFilter(this.filterData);
      this.save();
      this.$emit("onChange",true,{});
    },

    computeFilters(filterData, filterInfo, matchAttribute = "value") {
      let filters={};
      for (var key in filterData) {
        let array=filterData[key];
        let info=filterInfo[key];
        var filter;
        if (info.multiple) {
          filter = [];
          array.forEach(function(item) {
            if (item.checked) {
              filter.push(item[matchAttribute]);
            }
          });
        }
        else {
          filter = "";
          array.forEach(function(item) {
            if (item.checked) {
              if (typeof item.all === "undefined" || !item.all) {
                filter = item[matchAttribute];
              } else {
                filter = "";
              }
            }
          });
        }
        if (filter!=null && filter!="")
          filters[key]=filter;
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
    resetFilter(filterData) {
      for (var key in filterData) {
         let array=filterData[key];
         let new_array = _.cloneDeep(array);
         new_array.forEach(function(element) {
           element.checked = false;
         });
         filterData[key]=new_array;
       }
    },
  }
}