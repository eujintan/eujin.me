export type HistoryItem={index:number;projectId:string;added:boolean};
export function undoLikes(liked:string[],last:HistoryItem){return last.added?liked.filter(id=>id!==last.projectId):liked;}
export function swipeDirection(x:number,y:number){return Math.abs(x)>95&&Math.abs(x)>Math.abs(y)?(x>0?'right':'left'):null;}
