// Registers Oruga's components (<o-table>, <o-select>, …) so vue-tsc
// type-checks their props in templates. This covers every Oruga component,
// but only those registered in plugins/oruga.ts render at runtime
import '@oruga-ui/oruga-next/globals'
