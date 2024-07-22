export interface AppConfig{
    bannerMessage: string;
    dwellingType: DwellingDetail[]
}


export interface DwellingDetail{
    fields : string[],
    id:number,
    name:string
}