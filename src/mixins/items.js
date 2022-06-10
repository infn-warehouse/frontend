import enums from "@/enums";
import _ from "lodash";

export default {
  mixins: [],
  computed: {
    enums() {
      return enums;
    }
  },

  methods: {
    mapValue(value,items,chip=false) {
      let a=_.filter(items, (v) => v.value==value);
      if (a.length==0)
        return {
          data: "?",
          dataType: chip ? "chip" : "text",
        };
      return {
        data: a[0].name,
        dataType: chip ? "chip" : "text",
        chipClass: a[0].chip
      }
    }
  },

  data() {
    return {
      orderItems: {
        statOrdine: [
          { name: this.$t("items.conto"), value: 'C', chip: "yellow" },
          { name: this.$t("items.saldo"), value: 'S', chip: "green" },
        ],
      },
      movementItems: {
        inUscita: [
          { name: this.$t("items.inbound"), value: false, chip: "green" },
          { name: this.$t("items.outbound"), value: true, chip: "blue" }
        ],
        tipoMovimento: [
          { name: this.$t("items.conto"), value: 'C', chip: "blue" },
          { name: this.$t("items.saldo"), value: 'S', chip: "green" }
        ],
        tipoCollaudo: [
          { name: this.$t("items.a_type"), value: "A" },
          { name: this.$t("items.b_type"), value: "B" },
          { name: this.$t("items.f_type"), value: "F" }
        ],
        tipoUscita: [
          { name: this.$t("items.temporary"), value: "T" },
          { name: this.$t("items.permanent"), value: "P" },
        ],
        tipoReso: [
          { name: this.$t("items.total"), value: "T" },
          { name: this.$t("items.partial"), value: "P" },
        ]
      }
    }
  }
}