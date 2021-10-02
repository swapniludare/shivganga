export interface Process {
    id:string,
    name: string,
    remark: string,
    time:number //in milliseconds,
    items?: ProcessDefinition[]
}

export interface ProcessDefinition {
    id: string,
    process: string,
    sku: string,
    flag: 'i' | 'o'
}
