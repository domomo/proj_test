import { api, getToken } from './client'
export const EVENT_TYPES = ['page_view','search','filter_use','content_view','recommendation_click','recommendation_impression','bookmark_add','bookmark_remove','review_submit','review_delete','survey_submit','reservation_checkout_started','payment_verified','payment_cancelled'] as const
export type EventType = typeof EVENT_TYPES[number]
export interface ActivityEvent { event_id:string; type:EventType; occurred_at:string; session_id:string; anonymous_id:string; page:{path:string;referrer:string}; props:Record<string,unknown>; schema_version:4 }
const KEY='culturepick.events.queue', MAX=10
const read=():ActivityEvent[]=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v.slice(-MAX):[]}catch{return []}}
let queue=read(), sending=false
const id=(key:string)=>{let value=sessionStorage.getItem(key);if(!value){value=crypto.randomUUID();sessionStorage.setItem(key,value)}return value}
const save=()=>localStorage.setItem(KEY,JSON.stringify(queue))
export async function flushEvents(){if(!getToken()||!queue.length||sending)return;sending=true;const batch=queue.slice(0,MAX);try{await api('/history/events/batch',{method:'POST',body:JSON.stringify({events:batch})});const ids=new Set(batch.map(e=>e.event_id));queue=queue.filter(e=>!ids.has(e.event_id));save();if(queue.length>=MAX)void flushEvents()}catch{/* Retain events for retry. */}finally{sending=false}}
export function track(type:EventType,props:Record<string,unknown>={}){if(!getToken())return;queue.push({event_id:crypto.randomUUID(),type,occurred_at:new Date().toISOString(),session_id:id('culturepick.events.session'),anonymous_id:id('culturepick.events.browser'),page:{path:location.pathname+location.search,referrer:document.referrer},props,schema_version:4});if(queue.length>MAX)queue=queue.slice(-MAX);save();if(queue.length===MAX)void flushEvents()}
export function startEventQueue(){const flush=()=>void flushEvents();const timer=window.setInterval(flush,3000);window.addEventListener('online',flush);window.addEventListener('pagehide',flush);flush();return()=>{clearInterval(timer);window.removeEventListener('online',flush);window.removeEventListener('pagehide',flush)}}
