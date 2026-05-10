import{s as e}from"./chunk-Bj-mKKzh.js";import{n as t,t as n}from"./jsx-runtime-CtnhcczV.js";import{A as r,C as i,O as a,_ as o,f as s,h as c,w as l}from"./diff-view-mode-DTocf3LZ.js";import{C as u,D as d,O as f,S as p,_ as m,h,k as g,x as _}from"./WorkerPoolContext-CkNecaae.js";function v(e,t){return e?.start===t?.start&&e?.end===t?.end&&e?.side===t?.side&&e?.endSide===t?.endSide}function y(){return d({tagName:`button`,properties:{"data-utility-button":``,type:`button`},children:[f({name:`diffs-icon-plus`,properties:{"data-icon":``}})]})}function b(e,t){return e.lineNumber===t.lineNumber&&e.side===t.side}var x=class{hoveredLine;hoveredToken;pre;gutterUtilityContainer;gutterUtilityButton;gutterUtilitySlot;interactiveLinesAttr=!1;interactiveLineNumbersAttr=!1;hasPointerListeners=!1;hasDocumentPointerListeners=!1;selectedRange=null;renderedSelectionRange;selectionAnchor;queuedSelectionRender;pointerSession={mode:`idle`};constructor(e,t){this.mode=e,this.options=t}setOptions(e){this.options=e}cleanUp(){this.pre?.removeEventListener(`click`,this.handlePointerClick),this.pre?.removeEventListener(`pointerdown`,this.handlePointerDown),this.pre?.removeEventListener(`pointermove`,this.handlePointerMove),this.pre?.removeEventListener(`pointerleave`,this.handlePointerLeave),this.pre?.removeAttribute(`data-interactive-lines`),this.pre?.removeAttribute(`data-interactive-line-numbers`),this.pre=void 0,this.gutterUtilityContainer?.remove(),this.gutterUtilityContainer=void 0,this.gutterUtilityButton=void 0,this.gutterUtilitySlot=void 0,this.clearHoveredLine(),this.clearHoveredToken(),this.detachDocumentPointerListeners(),this.clearPointerSession(),this.queuedSelectionRender!=null&&(cancelAnimationFrame(this.queuedSelectionRender),this.queuedSelectionRender=void 0),this.interactiveLinesAttr=!1,this.interactiveLineNumbersAttr=!1,this.hasPointerListeners=!1}setup(e){this.setSelectionDirty();let{usesCustomGutterUtility:t=!1,enableGutterUtility:n=!1}=this.options;this.pre!==e&&(this.cleanUp(),this.pre=e),n?this.ensureGutterUtilityNode(t):this.gutterUtilityContainer!=null&&(this.gutterUtilityContainer.remove(),this.gutterUtilityContainer=void 0,this.gutterUtilityButton=void 0,this.gutterUtilitySlot=void 0,this.pointerSession.mode===`gutterSelecting`&&(this.clearPointerSession(),this.detachDocumentPointerListeners())),this.syncPointerListeners(e),this.updateInteractiveLineAttributes(),this.renderSelection()}setSelectionDirty(){this.renderedSelectionRange=void 0}isSelectionDirty(){return this.renderedSelectionRange===null}setSelection(e){let t=!(e===this.selectedRange||v(e??void 0,this.selectedRange??void 0));!this.isSelectionDirty()&&!t||(this.selectedRange=e,this.renderSelection(),t&&this.notifySelectionCommitted())}getSelection(){return this.selectedRange}getHoveredLine=()=>{if(this.hoveredLine!=null){if(this.mode===`diff`&&this.hoveredLine.type===`diff-line`)return{lineNumber:this.hoveredLine.lineNumber,side:this.hoveredLine.annotationSide};if(this.mode===`file`&&this.hoveredLine.type===`line`)return{lineNumber:this.hoveredLine.lineNumber}}};handlePointerClick=e=>{let{onHunkExpand:t,onLineClick:n,onLineNumberClick:r,onTokenClick:i,onMergeConflictActionClick:a}=this.options;t==null&&n==null&&r==null&&a==null&&i==null||this.options.onGutterUtilityClick!=null&&k(e.composedPath())||(A(this.options.__debugPointerEvents,`click`,`FileDiff.DEBUG.handlePointerClick:`,e),this.handlePointerEvent({eventType:`click`,event:e}))};handlePointerMove=e=>{let{lineHoverHighlight:t=`disabled`,onLineEnter:n,onLineLeave:r,onTokenEnter:i,onTokenLeave:a,enableGutterUtility:o=!1}=this.options;t===`disabled`&&!o&&n==null&&r==null&&i==null&&a==null||(A(this.options.__debugPointerEvents,`move`,`FileDiff.DEBUG.handlePointerMove:`,e),this.handlePointerEvent({eventType:`move`,event:e}))};handlePointerLeave=e=>{let{__debugPointerEvents:t}=this.options;if(A(t,`move`,`FileDiff.DEBUG.handlePointerLeave: no event`),this.hoveredLine==null&&this.hoveredToken==null){A(t,`move`,`FileDiff.DEBUG.handlePointerLeave: returned early, no hovered line or token`);return}this.gutterUtilityContainer?.remove(),this.hoveredToken!=null&&(this.options.onTokenLeave?.(this.hoveredToken,e),this.clearHoveredToken()),this.hoveredLine!=null&&(this.options.onLineLeave?.({...this.hoveredLine,event:e}),this.clearHoveredLine())};handlePointerEvent({eventType:e,event:t}){let{__debugPointerEvents:n}=this.options,r=t.composedPath();A(n,e,`FileDiff.DEBUG.handlePointerEvent:`,{eventType:e,composedPath:r});let i=this.resolvePointerTarget(r);A(n,e,`FileDiff.DEBUG.handlePointerEvent: resolvePointerTarget result:`,i);let{onLineClick:a,onLineNumberClick:o,onLineEnter:s,onLineLeave:c,onTokenClick:l,onTokenEnter:u,onTokenLeave:d,onHunkExpand:f,onMergeConflictActionClick:p}=this.options;switch(e){case`move`:{let e=T(i)&&this.hoveredLine?.lineElement===i.lineElement;w(i)&&this.hoveredToken?.tokenElement===i.tokenElement||(this.hoveredToken!=null&&(d?.(this.hoveredToken,t),this.clearHoveredToken()),w(i)&&(this.setHoveredToken(this.toTokenEventBaseProps(i)),u?.(this.hoveredToken,t))),e||(this.hoveredLine!=null&&(this.gutterUtilityContainer?.remove(),c?.({...this.hoveredLine,event:t}),this.clearHoveredLine()),T(i)&&(this.setHoveredLine(this.toEventBaseProps(i)),this.gutterUtilityContainer!=null&&i.numberElement.appendChild(this.gutterUtilityContainer),s?.({...this.hoveredLine,event:t})));break}case`click`:{if(i==null)break;if(ne(i)&&p!=null){p(i);break}if(te(i)&&f!=null){f(i.hunkIndex,i.all||t.shiftKey?`both`:i.direction,i.all||t.shiftKey?1/0:void 0);break}if(!T(i))break;w(i)&&l!=null&&l(this.toTokenEventBaseProps(i),t);let e=this.toEventBaseProps(i);o!=null&&i.numberColumn?o({...e,event:t}):a?.({...e,event:t});break}}}syncPointerListeners(e){let{__debugPointerEvents:t,lineHoverHighlight:n=`disabled`,onLineClick:r,onLineNumberClick:i,onLineEnter:a,onLineLeave:o,onTokenClick:s,onTokenEnter:c,onTokenLeave:l,onHunkExpand:u,onMergeConflictActionClick:d,enableGutterUtility:f=!1,enableLineSelection:p=!1,onGutterUtilityClick:m}=this.options,h=m!=null,g=n!==`disabled`||r!=null||i!=null||a!=null||o!=null||s!=null||c!=null||l!=null||u!=null||d!=null||f||p||h;g&&!this.hasPointerListeners?(e.addEventListener(`click`,this.handlePointerClick),e.addEventListener(`pointerdown`,this.handlePointerDown),e.addEventListener(`pointermove`,this.handlePointerMove),e.addEventListener(`pointerleave`,this.handlePointerLeave),this.hasPointerListeners=!0,A(t,`click`,`FileDiff.DEBUG.attachEventListeners: Attaching click events for:`,(()=>{let e=[];return(t===`both`||t===`click`)&&(r!=null&&e.push(`onLineClick`),i!=null&&e.push(`onLineNumberClick`),u!=null&&e.push(`expandable hunk separators`),d!=null&&e.push(`merge conflict actions`)),e})()),A(t,`move`,`FileDiff.DEBUG.attachEventListeners: Attaching pointer move event`),A(t,`move`,`FileDiff.DEBUG.attachEventListeners: Attaching pointer leave event`)):!g&&this.hasPointerListeners&&(e.removeEventListener(`click`,this.handlePointerClick),e.removeEventListener(`pointerdown`,this.handlePointerDown),e.removeEventListener(`pointermove`,this.handlePointerMove),e.removeEventListener(`pointerleave`,this.handlePointerLeave),this.hasPointerListeners=!1);let _=this.pointerSession.mode===`selecting`||this.pointerSession.mode===`pendingSingleLineUnselect`,v=this.pointerSession.mode===`gutterSelecting`;(!p&&_||!h&&v)&&(this.clearPointerSession(),this.detachDocumentPointerListeners(),this.selectionAnchor=void 0,this.clearPendingSingleLineState())}updateInteractiveLineAttributes(){if(this.pre==null)return;let{onLineClick:e,onLineNumberClick:t,enableLineSelection:n=!1}=this.options,r=e!=null,i=t!=null||n;r&&!this.interactiveLinesAttr?(this.pre.setAttribute(`data-interactive-lines`,``),this.interactiveLinesAttr=!0):!r&&this.interactiveLinesAttr&&(this.pre.removeAttribute(`data-interactive-lines`),this.interactiveLinesAttr=!1),i&&!this.interactiveLineNumbersAttr?(this.pre.setAttribute(`data-interactive-line-numbers`,``),this.interactiveLineNumbersAttr=!0):!i&&this.interactiveLineNumbersAttr&&(this.pre.removeAttribute(`data-interactive-line-numbers`),this.interactiveLineNumbersAttr=!1)}handlePointerDown=e=>{if(e.pointerType===`mouse`&&e.button!==0||this.pre==null||this.pointerSession.mode!==`idle`)return;let t=e.composedPath();k(t)&&this.options.onGutterUtilityClick!=null?this.startGutterSelectionFromPointerDown(e,t):this.startLineSelectionFromPointerDown(e,t)};startLineSelectionFromPointerDown(e,t){let{enableLineSelection:n=!1}=this.options;if(!n)return;let r=this.getSelectionPointerInfo(t,!0);if(r==null)return;let{pre:i}=this;if(i==null)return;e.preventDefault();let{lineNumber:a,eventSide:o,lineIndex:s}=r;if(e.shiftKey&&this.selectedRange!=null){let t=this.getIndexesFromSelection(this.selectedRange,i.getAttribute(`data-diff-type`)===`split`);if(t==null)return;let n=t.start<=t.end?s>=t.start:s<=t.end;this.selectionAnchor={lineNumber:n?this.selectedRange.start:this.selectedRange.end,side:n?this.selectedRange.side:this.selectedRange.endSide??this.selectedRange.side},this.updateSelection(a,o,!1),this.notifySelectionStart(this.selectedRange),this.pointerSession={mode:`selecting`,pointerId:e.pointerId},this.attachDocumentPointerListeners();return}if(this.selectedRange?.start===a&&this.selectedRange?.end===a){let t={lineNumber:a,side:o};this.selectionAnchor=t,this.pointerSession={mode:`pendingSingleLineUnselect`,pointerId:e.pointerId,anchor:t,pending:t},this.attachDocumentPointerListeners();return}this.selectedRange=null,this.selectionAnchor={lineNumber:a,side:o},this.updateSelection(a,o,!1),this.notifySelectionStart(this.selectedRange),this.pointerSession={mode:`selecting`,pointerId:e.pointerId},this.attachDocumentPointerListeners()}startGutterSelectionFromPointerDown(e,t){let{enableLineSelection:n=!1,onGutterUtilityClick:r}=this.options;if(r==null)return;let i=this.getSelectionPointFromPath(t);i!=null&&(e.preventDefault(),e.stopPropagation(),this.pointerSession={mode:`gutterSelecting`,pointerId:e.pointerId,anchor:i,current:i},n&&(this.selectionAnchor={lineNumber:i.lineNumber,side:i.side},this.updateSelection(i.lineNumber,i.side,!1),this.notifySelectionStart(this.selectedRange)),this.attachDocumentPointerListeners())}handleDocumentPointerMove=e=>{let{enableLineSelection:t=!1}=this.options;switch(this.pointerSession.mode){case`idle`:return;case`gutterSelecting`:{if(e.pointerId!==this.pointerSession.pointerId)return;let n=this.getSelectionPointFromPath(e.composedPath());if(n==null)return;this.pointerSession.current=n,t===!0&&this.updateSelection(n.lineNumber,n.side);return}case`selecting`:{if(e.pointerId!==this.pointerSession.pointerId)return;let t=this.getSelectionPointerInfo(e.composedPath(),!1);if(t==null||this.selectionAnchor==null)return;this.updateSelection(t.lineNumber,t.eventSide);return}case`pendingSingleLineUnselect`:{if(e.pointerId!==this.pointerSession.pointerId)return;let t=this.getSelectionPointerInfo(e.composedPath(),!1);if(t==null||this.selectionAnchor==null)return;let n={lineNumber:t.lineNumber,side:t.eventSide};if(b(this.pointerSession.pending,n))return;this.updateSelection(t.lineNumber,t.eventSide,!1),this.notifySelectionStart(this.selectedRange),this.notifySelectionChangeDelta(),this.pointerSession={mode:`selecting`,pointerId:e.pointerId};return}}};handleDocumentPointerUp=e=>{let{enableLineSelection:t=!1,onGutterUtilityClick:n}=this.options;switch(this.pointerSession.mode){case`idle`:return;case`gutterSelecting`:{if(e.pointerId!==this.pointerSession.pointerId)return;let r=this.getSelectionPointFromPath(e.composedPath());r!=null&&(this.pointerSession.current=r,t&&this.updateSelection(r.lineNumber,r.side)),n?.(this.buildSelectedLineRange(this.pointerSession.anchor,this.pointerSession.current)),this.selectionAnchor=void 0,t&&(this.notifySelectionEnd(this.selectedRange),this.notifySelectionCommitted()),this.clearPointerSession(),this.detachDocumentPointerListeners();return}case`pendingSingleLineUnselect`:if(e.pointerId!==this.pointerSession.pointerId)return;this.updateSelection(null,void 0,!1),this.selectionAnchor=void 0,this.clearPendingSingleLineState(),this.detachDocumentPointerListeners(),this.notifySelectionEnd(this.selectedRange),this.notifySelectionCommitted();return;case`selecting`:if(e.pointerId!==this.pointerSession.pointerId)return;this.selectionAnchor=void 0,this.detachDocumentPointerListeners(),this.clearPointerSession(),this.notifySelectionEnd(this.selectedRange),this.notifySelectionCommitted()}};handleDocumentPointerCancel=e=>{switch(this.pointerSession.mode){case`idle`:return;case`gutterSelecting`:case`selecting`:case`pendingSingleLineUnselect`:if(`pointerId`in this.pointerSession&&e.pointerId!==this.pointerSession.pointerId)return;this.selectionAnchor=void 0,this.clearPendingSingleLineState(),this.clearPointerSession(),this.detachDocumentPointerListeners()}};clearHoveredLine(){this.hoveredLine!=null&&(this.hoveredLine.lineElement.removeAttribute(`data-hovered`),this.hoveredLine.numberElement.removeAttribute(`data-hovered`),this.hoveredLine=void 0)}setHoveredLine(e){let{lineHoverHighlight:t=`disabled`}=this.options;this.hoveredLine!=null&&this.clearHoveredLine(),this.hoveredLine=e,t!==`disabled`&&((t===`both`||t===`line`)&&this.hoveredLine.lineElement.setAttribute(`data-hovered`,``),(t===`both`||t===`number`)&&this.hoveredLine.numberElement.setAttribute(`data-hovered`,``))}clearHoveredToken(){this.hoveredToken!=null&&(this.hoveredToken=void 0)}setHoveredToken(e){this.hoveredToken!=null&&this.clearHoveredToken(),this.hoveredToken=e}ensureGutterUtilityNode(e){if(this.gutterUtilityContainer??(this.gutterUtilityContainer=document.createElement(`div`),this.gutterUtilityContainer.setAttribute(`data-gutter-utility-slot`,``)),e)this.gutterUtilityButton!=null&&(this.gutterUtilityButton.remove(),this.gutterUtilityButton=void 0),this.gutterUtilitySlot??(this.gutterUtilitySlot=document.createElement(`slot`),this.gutterUtilitySlot.name=`gutter-utility-slot`),this.gutterUtilitySlot.parentNode!==this.gutterUtilityContainer&&this.gutterUtilityContainer.replaceChildren(this.gutterUtilitySlot);else{if(this.gutterUtilitySlot?.remove(),this.gutterUtilitySlot=void 0,this.gutterUtilityButton==null){let e=document.createElement(`div`);e.innerHTML=u(y());let t=e.firstElementChild;if(!(t instanceof HTMLButtonElement))throw Error(`InteractionManager.ensureGutterUtilityNode: Node element should be a button`);t.remove(),this.gutterUtilityButton=t}this.gutterUtilityButton.parentNode!==this.gutterUtilityContainer&&this.gutterUtilityContainer.replaceChildren(this.gutterUtilityButton)}}attachDocumentPointerListeners(){this.hasDocumentPointerListeners||=(document.addEventListener(`pointermove`,this.handleDocumentPointerMove),document.addEventListener(`pointerup`,this.handleDocumentPointerUp),document.addEventListener(`pointercancel`,this.handleDocumentPointerCancel),!0)}detachDocumentPointerListeners(){this.hasDocumentPointerListeners&&=(document.removeEventListener(`pointermove`,this.handleDocumentPointerMove),document.removeEventListener(`pointerup`,this.handleDocumentPointerUp),document.removeEventListener(`pointercancel`,this.handleDocumentPointerCancel),!1)}clearPointerSession(){this.pointerSession={mode:`idle`}}clearPendingSingleLineState(){this.pointerSession.mode===`pendingSingleLineUnselect`&&(this.pointerSession={mode:`idle`})}getSelectionPointerInfo(e,t){let n=this.resolvePointerTarget(e);if(C(n)&&!(t&&!n.numberColumn)&&n.splitLineIndex!=null)return{lineIndex:n.splitLineIndex,lineNumber:n.lineNumber,eventSide:this.mode===`diff`?n.side:void 0}}getSelectionPointFromPath(e){let t=this.resolvePointerTarget(e);if(C(t))return{lineNumber:t.lineNumber,side:this.mode===`diff`?t.side:void 0}}getLineIndex(e,t){let{getLineIndex:n}=this.options;return n==null?[e-1,e-1]:n(e,t)}updateSelection(e,t,n=!0){let{selectedRange:r}=this,i;if(e==null)i=null;else{let n=this.selectionAnchor?.side??t,r=this.selectionAnchor?.lineNumber??e;i=this.buildSelectionRange(r,e,n,t)}v(r??void 0,i??void 0)||(this.selectedRange=i,n&&this.notifySelectionChangeDelta(),this.queuedSelectionRender??=requestAnimationFrame(this.renderSelection))}getIndexesFromSelection(e,t){if(this.pre==null)return;let n=this.getLineIndex(e.start,e.side),r=this.getLineIndex(e.end,e.endSide??e.side);return n!=null&&r!=null?{start:t?n[1]:n[0],end:t?r[1]:r[0]}:void 0}renderSelection=()=>{if(this.queuedSelectionRender!=null&&(cancelAnimationFrame(this.queuedSelectionRender),this.queuedSelectionRender=void 0),this.pre==null||this.renderedSelectionRange===this.selectedRange)return;let e=this.pre.querySelectorAll(`[data-selected-line]`);for(let t of e)t.removeAttribute(`data-selected-line`);if(this.renderedSelectionRange=this.selectedRange,this.selectedRange==null)return;let{children:t}=this.pre;if(t.length===0)return;if(t.length>2)throw console.error(t),Error(`InteractionManager.renderSelection: Somehow there are more than 2 code elements...`);let n=this.pre.getAttribute(`data-diff-type`)===`split`,r=this.getIndexesFromSelection(this.selectedRange,n);if(r==null)throw console.error({rowRange:r,selectedRange:this.selectedRange}),Error(`InteractionManager.renderSelection: No valid rowRange`);let i=r.start===r.end,a=Math.min(r.start,r.end),o=Math.max(r.start,r.end);for(let e of t){let[t,r]=e.children,s=r.children.length;if(s!==t.children.length)throw Error(`InteractionManager.renderSelection: gutter and content children dont match, something is wrong`);for(let e=0;e<s;e++){let s=r.children[e],c=t.children[e];if(!(s instanceof HTMLElement)||!(c instanceof HTMLElement))continue;let l=this.parseLineIndex(s,n);if((l??0)>o)break;if(l==null||l<a)continue;let u=i?`single`:l===a?`first`:l===o?`last`:``;s.setAttribute(`data-selected-line`,u),c.setAttribute(`data-selected-line`,u),c.nextSibling instanceof HTMLElement&&s.nextSibling instanceof HTMLElement&&(s.nextSibling.hasAttribute(`data-line-annotation`)||s.nextSibling.hasAttribute(`data-merge-conflict-actions`))&&(i?(u=`last`,s.setAttribute(`data-selected-line`,`first`)):l===a?u=``:l===o&&s.setAttribute(`data-selected-line`,``),s.nextSibling.setAttribute(`data-selected-line`,u),c.nextSibling.setAttribute(`data-selected-line`,u))}}};notifySelectionCommitted(){this.options.onLineSelected?.(this.selectedRange??null)}notifySelectionChangeDelta(){this.options.onLineSelectionChange?.(this.selectedRange??null)}notifySelectionStart(e){this.options.onLineSelectionStart?.(e)}notifySelectionEnd(e){this.options.onLineSelectionEnd?.(e)}toEventBaseProps(e){return this.mode===`file`?{type:`line`,lineElement:e.lineElement,lineNumber:e.lineNumber,numberColumn:e.numberColumn,numberElement:e.numberElement}:{type:`diff-line`,annotationSide:e.side,lineType:e.lineType,lineElement:e.lineElement,numberElement:e.numberElement,lineNumber:e.lineNumber,numberColumn:e.numberColumn}}toTokenEventBaseProps({lineCharEnd:e,lineCharStart:t,lineNumber:n,side:r,tokenElement:i,tokenText:a}){return this.mode===`file`?{type:`token`,lineCharEnd:e,lineCharStart:t,lineNumber:n,tokenElement:i,tokenText:a}:{type:`token`,lineCharEnd:e,lineCharStart:t,lineNumber:n,side:r,tokenElement:i,tokenText:a}}buildSelectedLineRange(e,t){return this.buildSelectionRange(e.lineNumber,t.lineNumber,e.side,t.side)}buildSelectionRange(e,t,n,r){return{start:e,end:t,...n==null?{}:{side:n},...n!==r&&r!=null?{endSide:r}:{}}}resolvePointerTarget(e){let t=!1,n,r,i,a,o,s,c,l,u,d;for(let f of e){if(!(f instanceof HTMLElement))continue;if(d==null&&f.hasAttribute(`data-merge-conflict-action`)){let e=f.getAttribute(`data-merge-conflict-action`)??void 0,t=f.getAttribute(`data-merge-conflict-conflict-index`)??void 0,n=t==null?NaN:Number.parseInt(t,10);re(e)&&Number.isFinite(n)&&(d={kind:`merge-conflict-action`,resolution:e,conflictIndex:n})}if(s==null&&f.hasAttribute(`data-char`)){s=f;let e=f.getAttribute(`data-char`);if(e!=null){let t=Number.parseInt(e,10);if(!Number.isNaN(t)){let e=f.textContent??``,n=t+e.length;(e.trim()!==``||this.options.enableTokenInteractionsOnWhitespace===!0)&&(c={tokenElement:s,lineCharStart:t,lineCharEnd:n,tokenText:e});continue}}}let e=o==null?f.getAttribute(`data-column-number`)??void 0:void 0;if(e!=null){o=f,u=Number.parseInt(e,10),t=!0,n=O(f),a=f.getAttribute(`data-line-index`)??void 0;continue}let p=i==null?f.getAttribute(`data-line`)??void 0:void 0;if(p!=null){i=f,u=Number.parseInt(p,10),n=O(f),a=f.getAttribute(`data-line-index`)??void 0;continue}if(l==null&&(f.hasAttribute(`data-expand-button`)||f.hasAttribute(`data-unmodified-lines`))){l={hunkIndex:void 0,direction:f.hasAttribute(`data-expand-up`)?`up`:f.hasAttribute(`data-expand-down`)?`down`:`both`,all:f.hasAttribute(`data-expand-all-button`)};continue}let m=l==null?void 0:f.getAttribute(`data-expand-index`)??void 0;if(l!=null&&m!=null){let e=Number.parseInt(m,10);Number.isNaN(e)||(l.hunkIndex=e);continue}if(r==null&&f.hasAttribute(`data-code`)){r=f;break}}if(d!=null)return d;if(l?.hunkIndex!=null)return{type:`line-info`,hunkIndex:l.hunkIndex,direction:l.direction,all:l.all};if(i??=a==null?void 0:E(r,`[data-line][data-line-index="${a}"]`),o??=a==null?void 0:E(r,`[data-column-number][data-line-index="${a}"]`),r==null||i==null||o==null||n==null||u==null||Number.isNaN(u))return;let f=this.parseLineIndex(i,this.isSplitDiff());return c==null?this.mode===`file`?{kind:`line`,lineType:n,lineElement:i,lineNumber:u,numberColumn:t,numberElement:o,side:void 0,splitLineIndex:f}:{kind:`line`,lineType:n,lineElement:i,lineNumber:u,numberColumn:t,numberElement:o,side:D(n,r),splitLineIndex:f}:this.mode===`file`?{kind:`token`,lineType:n,lineElement:i,lineNumber:u,numberColumn:t,numberElement:o,side:void 0,splitLineIndex:f,...c}:{kind:`token`,lineType:n,lineElement:i,lineNumber:u,numberColumn:t,numberElement:o,side:D(n,r),splitLineIndex:f,...c}}isSplitDiff(){return this.pre?.getAttribute(`data-diff-type`)===`split`}parseLineIndex(e,t){let n=(e.getAttribute(`data-line-index`)??``).split(`,`).map(e=>Number.parseInt(e,10)).filter(e=>!Number.isNaN(e));if(t&&n.length===2)return n[1];if(!t)return n[0]}};function S({enableTokenInteractionsOnWhitespace:e,enableGutterUtility:t,enableHoverUtility:n,lineHoverHighlight:r,onGutterUtilityClick:i,onLineClick:a,onLineEnter:o,onLineLeave:s,onLineNumberClick:c,onTokenClick:l,onTokenEnter:u,onTokenLeave:d,renderGutterUtility:f,renderHoverUtility:p,__debugPointerEvents:m,enableLineSelection:h,onLineSelected:g,onLineSelectionStart:_,onLineSelectionChange:v,onLineSelectionEnd:y},b,x,S){return{enableTokenInteractionsOnWhitespace:e,enableGutterUtility:ee({enableGutterUtility:t,enableHoverUtility:n,renderGutterUtility:f,renderHoverUtility:p,onGutterUtilityClick:i}),usesCustomGutterUtility:f!=null||p!=null,lineHoverHighlight:r,onGutterUtilityClick:i,onHunkExpand:b,onMergeConflictActionClick:S,onLineClick:a,onLineEnter:o,onLineLeave:s,onLineNumberClick:c,onTokenClick:l,onTokenEnter:u,onTokenLeave:d,__debugPointerEvents:m,enableLineSelection:h,onLineSelected:g,onLineSelectionStart:_,onLineSelectionChange:v,onLineSelectionEnd:y,getLineIndex:x}}function ee({enableGutterUtility:e,enableHoverUtility:t,renderGutterUtility:n,renderHoverUtility:r,onGutterUtilityClick:i}){if(e!==void 0&&t!==void 0)throw Error(`Cannot use both 'enableGutterUtility' and deprecated 'enableHoverUtility'. Use only 'enableGutterUtility'.`);if(n!=null&&r!=null)throw Error(`Cannot use both 'renderGutterUtility' and deprecated 'renderHoverUtility'. Use only 'renderGutterUtility'.`);if(i!=null&&(n!=null||r!=null))throw Error(`Cannot use both 'onGutterUtilityClick' and render utility callbacks ('renderGutterUtility'/'renderHoverUtility'). Use only one gutter utility API.`);return e??t??!1}function C(e){return e!=null&&`kind`in e&&e.kind===`line`}function w(e){return e!=null&&`kind`in e&&e.kind===`token`}function T(e){return C(e)||w(e)}function te(e){return`type`in e&&e.type===`line-info`}function ne(e){return`kind`in e&&e.kind===`merge-conflict-action`}function re(e){return e===`current`||e===`incoming`||e===`both`}function E(e,t){let n=e?.querySelector(t);return n instanceof HTMLElement?n:void 0}function D(e,t){switch(e){case`change-deletion`:return`deletions`;case`change-addition`:return`additions`;default:return t.hasAttribute(`data-deletions`)?`deletions`:`additions`}}function O(e){let t=e.getAttribute(`data-line-type`);if(t!=null)switch(t){case`change-deletion`:case`change-addition`:case`context`:case`context-expanded`:return t;default:return}}function k(e){for(let t of e)if(t instanceof HTMLElement&&t.hasAttribute(`data-utility-button`))return!0;return!1}function A(e=`none`,t,...n){switch(e){case`none`:return;case`both`:break;case`click`:if(t!==`click`)return;break;case`move`:if(t!==`move`)return;break}console.log(...n)}var j=class{observedNodes=new Map;queuedUpdates=new Map;cleanUp(){this.resizeObserver?.disconnect(),this.observedNodes.clear(),this.queuedUpdates.clear()}resizeObserver;setup(e,t){this.resizeObserver??=new ResizeObserver(this.handleResizeObserver);let n=e.querySelectorAll(`code`),r=new Map(this.observedNodes);this.observedNodes.clear();for(let e of n){let t=r.get(e);if(t!=null&&t.type!==`code`)throw Error(`ResizeManager.setup: somehow a code node is being used for an annotation, should be impossible`);let n=e.firstElementChild;n instanceof HTMLElement||(n=null),t==null?(t={type:`code`,codeElement:e,numberElement:n,codeWidth:`auto`,numberWidth:0},this.observedNodes.set(e,t),this.resizeObserver.observe(e),n!=null&&(this.observedNodes.set(n,t),this.resizeObserver.observe(n))):(this.observedNodes.set(e,t),r.delete(e),t.numberElement===n?t.numberElement!=null&&(r.delete(t.numberElement),this.observedNodes.set(t.numberElement,t)):(t.numberElement!=null&&this.resizeObserver.unobserve(t.numberElement),n!=null&&(this.resizeObserver.observe(n),r.delete(n),this.observedNodes.set(n,t)),t.numberElement=n))}if(n.length>1&&!t){let t=e.querySelectorAll(`[data-line-annotation*=","]`),n=new Map;for(let e of t){if(!(e instanceof HTMLElement))continue;let{lineAnnotation:t=``}=e.dataset;if(!/^\d+,\d+$/.test(t)){console.error(`DiffFileRenderer.setupResizeObserver: Invalid element or annotation`,{lineAnnotation:t,element:e});continue}let r=n.get(t);r??(r=[],n.set(t,r)),r.push(e)}for(let[e,t]of n){if(t.length!==2){console.error(`DiffFileRenderer.setupResizeObserver: Bad Pair`,e,t);continue}let[n,i]=t,a=n.firstElementChild,o=i.firstElementChild;if(!(n instanceof HTMLElement)||!(i instanceof HTMLElement)||!(a instanceof HTMLElement)||!(o instanceof HTMLElement))continue;let s=r.get(a);if(s!=null){this.observedNodes.set(a,s),this.observedNodes.set(o,s),r.delete(a),r.delete(o);continue}s={type:`annotations`,column1:{container:n,child:a,childHeight:a.getBoundingClientRect().height},column2:{container:i,child:o,childHeight:o.getBoundingClientRect().height},currentHeight:`auto`};let c=Math.max(s.column1.childHeight,s.column2.childHeight);this.applyNewHeight(s,c),this.observedNodes.set(a,s),this.observedNodes.set(o,s),this.resizeObserver.observe(a),this.resizeObserver.observe(o)}}for(let e of r.keys())e.isConnected&&(e.style.removeProperty(`--diffs-column-content-width`),e.style.removeProperty(`--diffs-column-number-width`),e.style.removeProperty(`--diffs-column-width`),e.parentElement instanceof HTMLElement&&e.parentElement.style.removeProperty(`--diffs-annotation-min-height`)),this.resizeObserver.unobserve(e);r.clear()}handleResizeObserver=e=>{for(let t of e){let{target:e,borderBoxSize:n,contentBoxSize:r}=t;if(!(e instanceof HTMLElement)){console.error(`FileDiff.handleResizeObserver: Invalid element for ResizeObserver`,t);continue}let i=this.observedNodes.get(e);if(i==null){console.error(`FileDiff.handleResizeObserver: Not a valid observed node`,t);continue}if(i.type===`annotations`){let t=(()=>{if(e===i.column1.child)return i.column1;if(e===i.column2.child)return i.column2})();if(t==null){console.error(`FileDiff.handleResizeObserver: Couldn't find a column for`,{item:i,target:e});continue}t.childHeight=n[0].blockSize;let r=Math.max(i.column1.childHeight,i.column2.childHeight);this.applyNewHeight(i,r)}else if(i.type===`code`){let t=[e,r[0].inlineSize],n=this.queuedUpdates.get(i)??[];n.push(t),this.queuedUpdates.set(i,n)}}this.handleColumnChange()};handleColumnChange=()=>{for(let[e,t]of this.queuedUpdates)for(let[n,r]of t)if(n===e.codeElement){let n=Math.max(Math.floor(r),0);if(n!==e.codeWidth){let t=Math.max(n-e.numberWidth,0);e.codeWidth=n===0?`auto`:n,e.codeElement.style.setProperty(`--diffs-column-content-width`,`${t>0?`${t}px`:`auto`}`),e.codeElement.style.setProperty(`--diffs-column-width`,`${typeof e.codeWidth==`number`?`${e.codeWidth}px`:`auto`}`)}e.numberElement!=null&&typeof e.codeWidth==`number`&&e.numberWidth===0&&t.push([e.numberElement,e.numberElement.getBoundingClientRect().width])}else if(n===e.numberElement){let t=Math.max(Math.ceil(r),0);if(t!==e.numberWidth&&(e.numberWidth=t,e.codeElement.style.setProperty(`--diffs-column-number-width`,`${e.numberWidth===0?`auto`:`${e.numberWidth}px`}`),e.codeWidth!==`auto`)){let t=Math.max(e.codeWidth-e.numberWidth,0);e.codeElement.style.setProperty(`--diffs-column-content-width`,`${t===0?`auto`:`${t}px`}`)}}this.queuedUpdates.clear()};applyNewHeight(e,t){t!==e.currentHeight&&(e.currentHeight=Math.max(t,0),e.column1.container.style.setProperty(`--diffs-annotation-min-height`,`${e.currentHeight}px`),e.column2.container.style.setProperty(`--diffs-annotation-min-height`,`${e.currentHeight}px`))}};function ie(e){for(let t of Array.isArray(e)?e:[e])if(!(t===`text`||t===`ansi`)&&!p.has(t))return!1;return!0}function ae(e){for(let t of m(e))if(!_.has(t))return!1;return!0}function oe(e,t){return e==null||t==null?e===t:e.startingLine===t.startingLine&&e.totalLines===t.totalLines&&e.bufferBefore===t.bufferBefore&&e.bufferAfter===t.bufferAfter}function se(e){return d({tagName:`div`,children:[d({tagName:`div`,children:e.annotations?.map(e=>d({tagName:`slot`,properties:{name:e}})),properties:{"data-annotation-content":``}})],properties:{"data-line-annotation":`${e.hunkIndex},${e.lineIndex}`}})}function ce(e){switch(e){case`file`:return`diffs-icon-file-code`;case`change`:return`diffs-icon-symbol-modified`;case`new`:return`diffs-icon-symbol-added`;case`deleted`:return`diffs-icon-symbol-deleted`;case`rename-pure`:case`rename-changed`:return`diffs-icon-symbol-moved`}}function le({fileOrDiff:e,mode:t}){let n=`type`in e?e:void 0,r={"data-diffs-header":t,"data-change-type":n?.type};return d({tagName:`div`,children:[t===`custom`?d({tagName:`slot`,properties:{name:s}}):ue({name:e.name,prevName:`prevName`in e?e.prevName:void 0,iconType:n?.type??`file`}),...t===`custom`?[]:[de(n)]],properties:r})}function ue({name:e,prevName:t,iconType:n}){let r=[d({tagName:`slot`,properties:{name:l}}),f({name:ce(n),properties:{"data-change-icon":n}})];return t!=null&&(r.push(d({tagName:`div`,children:[d({tagName:`bdi`,children:[g(t)]})],properties:{"data-prev-name":``}})),r.push(f({name:`diffs-icon-arrow-right-short`,properties:{"data-rename-icon":``}}))),r.push(d({tagName:`div`,children:[d({tagName:`bdi`,children:[g(e)]})],properties:{"data-title":``}})),d({tagName:`div`,children:r,properties:{"data-header-content":``}})}function de(e){let t=[];if(e!=null){let n=0,r=0;for(let t of e.hunks)n+=t.additionLines,r+=t.deletionLines;(r>0||n===0)&&t.push(d({tagName:`span`,children:[g(`-${r}`)],properties:{"data-deletions-count":``}})),(n>0||r===0)&&t.push(d({tagName:`span`,children:[g(`+${n}`)],properties:{"data-additions-count":``}}))}return t.push(d({tagName:`slot`,properties:{name:i}})),d({tagName:`div`,children:t,properties:{"data-metadata":``}})}function fe(e){return d({tagName:`pre`,properties:pe(e)})}function pe({diffIndicators:e,disableBackground:t,disableLineNumbers:n,overflow:r,split:i,totalLines:a,type:o,customProperties:s}){return{...s,"data-diff":o===`diff`?``:void 0,"data-file":o===`file`?``:void 0,"data-diff-type":o===`diff`?i?`split`:`single`:void 0,"data-overflow":r,"data-disable-line-numbers":n?``:void 0,"data-background":t?void 0:``,"data-indicators":e===`bars`||e===`classic`?e:void 0,tabIndex:0,style:`--diffs-min-number-column-width-default:${`${a}`.length}ch;`}}function me(e,{theme:t,preferredHighlighter:n=`shiki-js`}){return{langs:[e??`text`],themes:m(t),preferredHighlighter:n}}function he(e){return`annotation-${`side`in e?`${e.side}-`:``}${e.lineNumber}`}function ge(e,t){return d({tagName:`div`,children:e,properties:{"data-content":``,style:`grid-row: span ${t}`}})}function _e(e){return e.useTokenTransformer===!0||e.onTokenClick!=null||e.onTokenEnter!=null||e.onTokenLeave!=null}var ve=`<svg data-icon-sprite aria-hidden="true" width="0" height="0">
  <symbol id="diffs-icon-arrow-right-short" viewBox="0 0 16 16">
    <path d="M8.47 4.22a.75.75 0 0 0 0 1.06l1.97 1.97H3.75a.75.75 0 0 0 0 1.5h6.69l-1.97 1.97a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06L9.53 4.22a.75.75 0 0 0-1.06 0"/>
  </symbol>
  <symbol id="diffs-icon-brand-github" viewBox="0 0 16 16">
    <path d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"/>
  </symbol>
  <symbol id="diffs-icon-chevron" viewBox="0 0 16 16">
    <path d="M1.47 4.47a.75.75 0 0 1 1.06 0L8 9.94l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-1.06 0l-6-6a.75.75 0 0 1 0-1.06"/>
  </symbol>
  <symbol id="diffs-icon-chevrons-narrow" viewBox="0 0 10 16">
    <path d="M4.47 2.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1-1.06 1.06L5 3.81 2.28 6.53a.75.75 0 0 1-1.06-1.06zM1.22 9.47a.75.75 0 0 1 1.06 0L5 12.19l2.72-2.72a.75.75 0 0 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 0 1 0-1.06"/>
  </symbol>
  <symbol id="diffs-icon-diff-split" viewBox="0 0 16 16">
    <path d="M14 0H8.5v16H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m-1.5 6.5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0"/><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5.5V0zm.5 7.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1" opacity=".3"/>
  </symbol>
  <symbol id="diffs-icon-diff-unified" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5h16zm-8-4a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1A.5.5 0 0 0 8 10" clip-rule="evenodd"/><path fill-rule="evenodd" d="M14 0a2 2 0 0 1 2 2v5.5H0V2a2 2 0 0 1 2-2zM6.5 3.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" clip-rule="evenodd" opacity=".4"/>
  </symbol>
  <symbol id="diffs-icon-expand" viewBox="0 0 16 16">
    <path d="M3.47 5.47a.75.75 0 0 1 1.06 0L8 8.94l3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06"/>
  </symbol>
  <symbol id="diffs-icon-expand-all" viewBox="0 0 16 16">
    <path d="M11.47 9.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L8 12.94zM7.526 1.418a.75.75 0 0 1 1.004.052l4 4a.75.75 0 1 1-1.06 1.06L8 3.06 4.53 6.53a.75.75 0 1 1-1.06-1.06l4-4z"/>
  </symbol>
  <symbol id="diffs-icon-file-code" viewBox="0 0 16 16">
    <path d="M10.75 0c.199 0 .39.08.53.22l3.5 3.5c.14.14.22.331.22.53v9A2.75 2.75 0 0 1 12.25 16h-8.5A2.75 2.75 0 0 1 1 13.25V2.75A2.75 2.75 0 0 1 3.75 0zm-7 1.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V5h-1.25A2.25 2.25 0 0 1 10 2.75V1.5z"/><path d="M7.248 6.19a.75.75 0 0 1 .063 1.058L5.753 9l1.558 1.752a.75.75 0 0 1-1.122.996l-2-2.25a.75.75 0 0 1 0-.996l2-2.25a.75.75 0 0 1 1.06-.063M8.69 7.248a.75.75 0 1 1 1.12-.996l2 2.25a.75.75 0 0 1 0 .996l-2 2.25a.75.75 0 1 1-1.12-.996L10.245 9z"/>
  </symbol>
  <symbol id="diffs-icon-plus" viewBox="0 0 16 16">
    <path d="M8 3a.75.75 0 0 1 .75.75v3.5h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5v-3.5A.75.75 0 0 1 8 3"/>
  </symbol>
  <symbol id="diffs-icon-symbol-added" viewBox="0 0 16 16">
    <path d="M8 4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 4"/><path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/>
  </symbol>
  <symbol id="diffs-icon-symbol-deleted" viewBox="0 0 16 16">
    <path d="M4 8a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 8"/><path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/>
  </symbol>
  <symbol id="diffs-icon-symbol-diffstat" viewBox="0 0 16 16">
    <path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/><path d="M8.75 4.296a.75.75 0 0 0-1.5 0V6.25h-2a.75.75 0 0 0 0 1.5h2v1.5h1.5v-1.5h2a.75.75 0 0 0 0-1.5h-2zM5.25 10a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5z"/>
  </symbol>
  <symbol id="diffs-icon-symbol-ignored" viewBox="0 0 16 16">
    <path d="M1.5 8c0 1.613.088 2.806.288 3.704.196.88.478 1.381.802 1.706s.826.607 1.706.802c.898.2 2.091.288 3.704.288s2.806-.088 3.704-.288c.88-.195 1.381-.478 1.706-.802s.607-.826.802-1.706c.2-.898.288-2.091.288-3.704s-.088-2.806-.288-3.704c-.195-.88-.478-1.381-.802-1.706s-.826-.606-1.706-.802C10.806 1.588 9.613 1.5 8 1.5s-2.806.088-3.704.288c-.88.196-1.381.478-1.706.802s-.606.826-.802 1.706C1.588 5.194 1.5 6.387 1.5 8M0 8c0-6.588 1.412-8 8-8s8 1.412 8 8-1.412 8-8 8-8-1.412-8-8m11.53-2.47a.75.75 0 0 0-1.06-1.06l-6 6a.75.75 0 1 0 1.06 1.06z"/>
  </symbol>
  <symbol id="diffs-icon-symbol-modified" viewBox="0 0 16 16">
    <path d="M1.5 8c0 1.613.088 2.806.288 3.704.196.88.478 1.381.802 1.706s.826.607 1.706.802c.898.2 2.091.288 3.704.288s2.806-.088 3.704-.288c.88-.195 1.381-.478 1.706-.802s.607-.826.802-1.706c.2-.898.288-2.091.288-3.704s-.088-2.806-.288-3.704c-.195-.88-.478-1.381-.802-1.706s-.826-.606-1.706-.802C10.806 1.588 9.613 1.5 8 1.5s-2.806.088-3.704.288c-.88.196-1.381.478-1.706.802s-.606.826-.802 1.706C1.588 5.194 1.5 6.387 1.5 8M0 8c0-6.588 1.412-8 8-8s8 1.412 8 8-1.412 8-8 8-8-1.412-8-8m8 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
  </symbol>
  <symbol id="diffs-icon-symbol-moved" viewBox="0 0 16 16">
    <path d="M1.788 4.296c.196-.88.478-1.381.802-1.706s.826-.606 1.706-.802C5.194 1.588 6.387 1.5 8 1.5s2.806.088 3.704.288c.88.196 1.381.478 1.706.802s.607.826.802 1.706c.2.898.288 2.091.288 3.704s-.088 2.806-.288 3.704c-.195.88-.478 1.381-.802 1.706s-.826.607-1.706.802c-.898.2-2.091.288-3.704.288s-2.806-.088-3.704-.288c-.88-.195-1.381-.478-1.706-.802s-.606-.826-.802-1.706C1.588 10.806 1.5 9.613 1.5 8s.088-2.806.288-3.704M8 0C1.412 0 0 1.412 0 8s1.412 8 8 8 8-1.412 8-8-1.412-8-8-8"/><path d="M8.495 4.695a.75.75 0 0 0-.05 1.06L10.486 8l-2.041 2.246a.75.75 0 0 0 1.11 1.008l2.5-2.75a.75.75 0 0 0 0-1.008l-2.5-2.75a.75.75 0 0 0-1.06-.051m-4 0a.75.75 0 0 0-.05 1.06l2.044 2.248-1.796 1.995a.75.75 0 0 0 1.114 1.004l2.25-2.5a.75.75 0 0 0-.002-1.007l-2.5-2.75a.75.75 0 0 0-1.06-.05"/>
  </symbol>
  <symbol id="diffs-icon-symbol-ref" viewBox="0 0 16 16">
    <path d="M1.5 8c0 1.613.088 2.806.288 3.704.196.88.478 1.381.802 1.706.286.286.71.54 1.41.73V1.86c-.7.19-1.124.444-1.41.73-.324.325-.606.826-.802 1.706C1.588 5.194 1.5 6.387 1.5 8m4 6.397c.697.07 1.522.103 2.5.103 1.613 0 2.806-.088 3.704-.288.88-.195 1.381-.478 1.706-.802s.607-.826.802-1.706c.2-.898.288-2.091.288-3.704s-.088-2.806-.288-3.704c-.195-.88-.478-1.381-.802-1.706s-.826-.606-1.706-.802C10.806 1.588 9.613 1.5 8 1.5c-.978 0-1.803.033-2.5.103zM0 8c0-6.588 1.412-8 8-8s8 1.412 8 8-1.412 8-8 8-8-1.412-8-8m7-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"/>
  </symbol>
</svg>`;function M(e,t){return e==null||t==null?e===t:P(e.customProperties,t.customProperties)&&e.type===t.type&&e.diffIndicators===t.diffIndicators&&e.disableBackground===t.disableBackground&&e.disableLineNumbers===t.disableLineNumbers&&e.overflow===t.overflow&&e.split===t.split&&e.totalLines===t.totalLines}var N={};function P(e=N,t=N){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(let r of n)if(e[r]!==t[r])return!1;return!0}function F(e){let t=document.createElement(`div`);return t.dataset.annotationSlot=``,t.slot=e,t.style.whiteSpace=`normal`,t}function ye(){let e=document.createElement(`div`);return e.slot=`gutter-utility-slot`,e.style.position=`absolute`,e.style.top=`0`,e.style.bottom=`0`,e.style.textAlign=`center`,e.style.whiteSpace=`normal`,e}function be(){let e=document.createElement(`style`);return e.setAttribute(r,``),e}var xe=`@layer base, theme, rendered, unsafe;

@layer base {
  :host {
    --diffs-font-fallback:
      'SF Mono', Monaco, Consolas, 'Ubuntu Mono', 'Liberation Mono',
      'Courier New', monospace;
    --diffs-header-font-fallback:
      system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue',
      'Noto Sans', 'Liberation Sans', Arial, sans-serif;

    --diffs-mixer: light-dark(black, white);
    --diffs-gap-fallback: 8px;

    --diffs-added-light: #0dbe4e;
    --diffs-added-dark: #5ecc71;
    --diffs-modified-light: #009fff;
    --diffs-modified-dark: #69b1ff;
    --diffs-deleted-light: #ff2e3f;
    --diffs-deleted-dark: #ff6762;

    /*
    // Available CSS Color Overrides
    --diffs-bg-buffer-override
    --diffs-bg-hover-override
    --diffs-bg-context-override
    --diffs-bg-separator-override

    --diffs-fg-number-override
    --diffs-fg-number-addition-override
    --diffs-fg-number-deletion-override
    --diffs-fg-conflict-marker-override

    --diffs-deletion-color-override
    --diffs-addition-color-override
    --diffs-modified-color-override

    --diffs-bg-deletion-override
    --diffs-bg-deletion-number-override
    --diffs-bg-deletion-hover-override
    --diffs-bg-deletion-emphasis-override

    --diffs-bg-addition-override
    --diffs-bg-addition-number-override
    --diffs-bg-addition-hover-override
    --diffs-bg-addition-emphasis-override

    // Line Selection Color Overrides (for enableLineSelection)
    --diffs-selection-color-override
    --diffs-bg-selection-override
    --diffs-bg-selection-number-override
    --diffs-bg-selection-background-override
    --diffs-bg-selection-number-background-override

    // Available CSS Layout Overrides
    --diffs-gap-inline
    --diffs-gap-block
    --diffs-gap-style
    --diffs-tab-size
  */

    color-scheme: light dark;
    display: block;
    font-family: var(
      --diffs-header-font-family,
      var(--diffs-header-font-fallback)
    );
    font-size: var(--diffs-font-size, 13px);
    line-height: var(--diffs-line-height, 20px);
    font-feature-settings: var(--diffs-font-features);

    /* NOTE(amadeus): we cannot use 'in oklch' because current versions of cursor
     * and vscode use an older build of chrome that appears to have a bug with
     * color-mix and 'in oklch', so use 'in lab' instead */
    --diffs-bg: light-dark(
      var(--diffs-light-bg, #fff),
      var(--diffs-dark-bg, #000)
    );
    --diffs-bg-buffer: var(
      --diffs-bg-buffer-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 92%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 92%, var(--diffs-mixer))
      )
    );
    --diffs-bg-hover: var(
      --diffs-bg-hover-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 97%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-mixer))
      )
    );

    --diffs-bg-context: var(
      --diffs-bg-context-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 98.5%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 92.5%, var(--diffs-mixer))
      )
    );
    --diffs-bg-context-number: var(
      --diffs-bg-context-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg-context) 80%, var(--diffs-bg)),
        color-mix(in lab, var(--diffs-bg-context) 60%, var(--diffs-bg))
      )
    );
    --diffs-bg-conflict-marker: var(
      --diffs-bg-conflict-marker-override,
      light-dark(
        color-mix(
          in lab,
          var(--diffs-bg-context) 88%,
          var(--diffs-modified-base)
        ),
        color-mix(
          in lab,
          var(--diffs-bg-context) 80%,
          var(--diffs-modified-base)
        )
      )
    );
    --diffs-bg-conflict-current: var(
      --diffs-bg-conflict-current-override,
      light-dark(#e5f8ea, #274432)
    );
    --diffs-bg-conflict-base: var(
      --diffs-bg-conflict-base-override,
      light-dark(
        color-mix(
          in lab,
          var(--diffs-bg-context) 90%,
          var(--diffs-modified-base)
        ),
        color-mix(
          in lab,
          var(--diffs-bg-context) 82%,
          var(--diffs-modified-base)
        )
      )
    );
    --diffs-bg-conflict-incoming: var(
      --diffs-bg-conflict-incoming-override,
      light-dark(#e6f1ff, #253b5a)
    );
    --diffs-bg-conflict-marker-number: var(
      --diffs-bg-conflict-marker-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg-conflict-marker) 72%, var(--diffs-bg)),
        color-mix(in lab, var(--diffs-bg-conflict-marker) 54%, var(--diffs-bg))
      )
    );
    --diffs-bg-conflict-current-number: var(
      --diffs-bg-conflict-current-number-override,
      light-dark(#d7f1de, #30533d)
    );
    --diffs-bg-conflict-base-number: var(
      --diffs-bg-conflict-base-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg-conflict-base) 72%, var(--diffs-bg)),
        color-mix(in lab, var(--diffs-bg-conflict-base) 54%, var(--diffs-bg))
      )
    );
    --diffs-bg-conflict-incoming-number: var(
      --diffs-bg-conflict-incoming-number-override,
      light-dark(#d8e8ff, #2f4b73)
    );
    --conflict-bg-current: var(
      --conflict-bg-current-override,
      var(--diffs-bg-addition)
    );
    --conflict-bg-incoming: var(
      --conflict-bg-incoming-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 88%, var(--diffs-modified-base)),
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-modified-base))
      )
    );
    --conflict-bg-current-number: var(
      --conflict-bg-current-number-override,
      var(--diffs-bg-addition-number)
    );
    --conflict-bg-incoming-number: var(
      --conflict-bg-incoming-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-modified-base)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-modified-base))
      )
    );
    --conflict-bg-current-header: var(
      --conflict-bg-current-header-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 78%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 68%, var(--diffs-addition-base))
      )
    );
    --conflict-bg-incoming-header: var(
      --conflict-bg-incoming-header-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 78%, var(--diffs-modified-base)),
        color-mix(in lab, var(--diffs-bg) 68%, var(--diffs-modified-base))
      )
    );
    --conflict-bg-current-header-number: var(
      --conflict-bg-current-header-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 72%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 62%, var(--diffs-addition-base))
      )
    );
    --conflict-bg-incoming-header-number: var(
      --conflict-bg-incoming-header-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 72%, var(--diffs-modified-base)),
        color-mix(in lab, var(--diffs-bg) 62%, var(--diffs-modified-base))
      )
    );

    --diffs-bg-separator: var(
      --diffs-bg-separator-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 96%, var(--diffs-mixer)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-mixer))
      )
    );

    --diffs-fg: light-dark(var(--diffs-light, #000), var(--diffs-dark, #fff));
    --diffs-fg-number: var(
      --diffs-fg-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-fg) 65%, var(--diffs-bg)),
        color-mix(in lab, var(--diffs-fg) 65%, var(--diffs-bg))
      )
    );
    --diffs-fg-conflict-marker: var(
      --diffs-fg-conflict-marker-override,
      var(--diffs-fg-number)
    );

    --diffs-deletion-base: var(
      --diffs-deletion-color-override,
      light-dark(
        var(
          --diffs-light-deletion-color,
          var(--diffs-deletion-color, var(--diffs-deleted-light))
        ),
        var(
          --diffs-dark-deletion-color,
          var(--diffs-deletion-color, var(--diffs-deleted-dark))
        )
      )
    );
    --diffs-addition-base: var(
      --diffs-addition-color-override,
      light-dark(
        var(
          --diffs-light-addition-color,
          var(--diffs-addition-color, var(--diffs-added-light))
        ),
        var(
          --diffs-dark-addition-color,
          var(--diffs-addition-color, var(--diffs-added-dark))
        )
      )
    );
    --diffs-modified-base: var(
      --diffs-modified-color-override,
      light-dark(
        var(
          --diffs-light-modified-color,
          var(--diffs-modified-color, var(--diffs-modified-light))
        ),
        var(
          --diffs-dark-modified-color,
          var(--diffs-modified-color, var(--diffs-modified-dark))
        )
      )
    );

    /* NOTE(amadeus): we cannot use 'in oklch' because current versions of cursor
   * and vscode use an older build of chrome that appears to have a bug with
   * color-mix and 'in oklch', so use 'in lab' instead */
    --diffs-bg-deletion: var(
      --diffs-bg-deletion-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 88%, var(--diffs-deletion-base)),
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-deletion-base))
      )
    );
    --diffs-bg-deletion-number: var(
      --diffs-bg-deletion-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-deletion-base)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-deletion-base))
      )
    );
    --diffs-bg-deletion-hover: var(
      --diffs-bg-deletion-hover-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-deletion-base)),
        color-mix(in lab, var(--diffs-bg) 75%, var(--diffs-deletion-base))
      )
    );
    --diffs-bg-deletion-emphasis: var(
      --diffs-bg-deletion-emphasis-override,
      light-dark(
        rgb(from var(--diffs-deletion-base) r g b / 0.15),
        rgb(from var(--diffs-deletion-base) r g b / 0.2)
      )
    );

    --diffs-bg-addition: var(
      --diffs-bg-addition-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 88%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-addition-base))
      )
    );
    --diffs-bg-addition-number: var(
      --diffs-bg-addition-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 91%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 85%, var(--diffs-addition-base))
      )
    );
    --diffs-bg-addition-hover: var(
      --diffs-bg-addition-hover-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 80%, var(--diffs-addition-base)),
        color-mix(in lab, var(--diffs-bg) 70%, var(--diffs-addition-base))
      )
    );
    --diffs-bg-addition-emphasis: var(
      --diffs-bg-addition-emphasis-override,
      light-dark(
        rgb(from var(--diffs-addition-base) r g b / 0.15),
        rgb(from var(--diffs-addition-base) r g b / 0.2)
      )
    );

    --diffs-selection-base: var(--diffs-modified-base);
    --diffs-selection-number-fg: light-dark(
      color-mix(in lab, var(--diffs-selection-base) 65%, var(--diffs-mixer)),
      color-mix(in lab, var(--diffs-selection-base) 75%, var(--diffs-mixer))
    );
    --diffs-bg-selection: var(
      --diffs-bg-selection-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 82%, var(--diffs-selection-base)),
        color-mix(in lab, var(--diffs-bg) 75%, var(--diffs-selection-base))
      )
    );
    --diffs-bg-selection-number: var(
      --diffs-bg-selection-number-override,
      light-dark(
        color-mix(in lab, var(--diffs-bg) 75%, var(--diffs-selection-base)),
        color-mix(in lab, var(--diffs-bg) 60%, var(--diffs-selection-base))
      )
    );

    background-color: var(--diffs-bg);
    color: var(--diffs-fg);
  }

  /* NOTE(mdo): Some semantic HTML elements (e.g. \`pre\`, \`code\`) have default
 * user-agent styles. These must be overridden to use our custom styles. */
  pre,
  code,
  [data-error-wrapper] {
    isolation: isolate;
    margin: 0;
    padding: 0;
    display: block;
    outline: none;
    font-family: var(--diffs-font-family, var(--diffs-font-fallback));
  }

  pre,
  code {
    background-color: var(--diffs-bg);
  }

  code {
    contain: content;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  [data-icon-sprite] {
    display: none;
  }

  /* NOTE(mdo): Headers and separators are within pre/code, so we need to reset
   * their font-family explicitly. */
  [data-diffs-header],
  [data-separator] {
    font-family: var(
      --diffs-header-font-family,
      var(--diffs-header-font-fallback)
    );
  }

  [data-file-info] {
    padding: 10px;
    font-weight: 700;
    color: var(--fg);
    /* NOTE(amadeus): we cannot use 'in oklch' because current versions of cursor
   * and vscode use an older build of chrome that appears to have a bug with
   * color-mix and 'in oklch', so use 'in lab' instead */
    background-color: color-mix(in lab, var(--bg) 98%, var(--fg));
    border-block: 1px solid color-mix(in lab, var(--bg) 95%, var(--fg));
  }

  [data-diff],
  [data-file] {
    /* This feels a bit crazy to me... so I need to think about it a bit more... */
    --diffs-grid-number-column-width: minmax(min-content, max-content);
    --diffs-code-grid: var(--diffs-grid-number-column-width) 1fr;

    &[data-dehydrated] {
      --diffs-code-grid: var(--diffs-grid-number-column-width) minmax(0, 1fr);
    }

    &:hover [data-code]::-webkit-scrollbar-thumb {
      background-color: var(--diffs-bg-context);
    }
  }

  [data-line] span {
    color: light-dark(
      var(--diffs-token-light, var(--diffs-light)),
      var(--diffs-token-dark, var(--diffs-dark))
    );
    background-color: light-dark(
      var(--diffs-token-light-bg, inherit),
      var(--diffs-token-dark-bg, inherit)
    );
    font-weight: light-dark(
      var(--diffs-token-light-font-weight, inherit),
      var(--diffs-token-dark-font-weight, inherit)
    );
    font-style: light-dark(
      var(--diffs-token-light-font-style, inherit),
      var(--diffs-token-dark-font-style, inherit)
    );
    -webkit-text-decoration: light-dark(
      var(--diffs-token-light-text-decoration, inherit),
      var(--diffs-token-dark-text-decoration, inherit)
    );
            text-decoration: light-dark(
      var(--diffs-token-light-text-decoration, inherit),
      var(--diffs-token-dark-text-decoration, inherit)
    );
  }

  [data-line],
  [data-gutter-buffer],
  [data-line-annotation],
  [data-no-newline] {
    color: var(--diffs-fg);
    background-color: var(--diffs-line-bg, var(--diffs-bg));
  }

  [data-no-newline] {
    -webkit-user-select: none;
            user-select: none;

    span {
      opacity: 0.6;
    }
  }

  [data-diff-type='split'][data-overflow='scroll'] {
    display: grid;
    grid-template-columns: 1fr 1fr;

    [data-additions] {
      border-left: 1px solid var(--diffs-bg);
    }

    [data-deletions] {
      border-right: 1px solid var(--diffs-bg);
    }
  }

  [data-code] {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: var(--diffs-code-grid);
    overflow: scroll clip;
    overscroll-behavior-x: none;
    tab-size: var(--diffs-tab-size, 2);
    align-self: flex-start;
    padding-top: var(--diffs-gap-block, var(--diffs-gap-fallback));
    padding-bottom: max(
      0px,
      calc(var(--diffs-gap-block, var(--diffs-gap-fallback)) - 6px)
    );
  }

  [data-container-size] {
    container-type: inline-size;
  }

  [data-code]::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }

  [data-code]::-webkit-scrollbar-track {
    background: transparent;
  }

  [data-code]::-webkit-scrollbar-thumb {
    background-color: transparent;
    border: 1px solid transparent;
    background-clip: content-box;
    border-radius: 3px;
  }

  [data-code]::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  /*
   * If we apply these rules globally it will mean that webkit will opt into the
   * standards compliant version of custom css scrollbars, which we do not want
   * because the custom stuff will look better
  */
  @supports (-moz-appearance: none) {
    [data-code] {
      scrollbar-width: thin;
      scrollbar-color: var(--diffs-bg-context) transparent;
      padding-bottom: var(--diffs-gap-block, var(--diffs-gap-fallback));
    }
  }

  [data-diffs-header] ~ [data-diff],
  [data-diffs-header] ~ [data-file] {
    [data-code],
    &[data-overflow='wrap'] {
      padding-top: 0;
    }
  }

  [data-gutter] {
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: subgrid;
    grid-column: 1;
    z-index: 3;
    position: relative;
    background-color: var(--diffs-bg);

    [data-gutter-buffer],
    [data-column-number] {
      border-right: var(--diffs-gap-style, 2px solid var(--diffs-bg));
    }
  }

  [data-content] {
    display: grid;
    grid-template-rows: subgrid;
    grid-template-columns: subgrid;
    grid-column: 2;
    min-width: 0;
  }

  [data-diff-type='split'][data-overflow='wrap'] {
    display: grid;
    grid-auto-flow: dense;
    grid-template-columns: repeat(2, var(--diffs-code-grid));
    padding-block: var(--diffs-gap-block, var(--diffs-gap-fallback));

    [data-deletions] {
      display: contents;

      [data-gutter] {
        grid-column: 1;
      }

      [data-content] {
        grid-column: 2;
        border-right: 1px solid var(--diffs-bg);
      }
    }

    [data-additions] {
      display: contents;

      [data-gutter] {
        grid-column: 3;
        border-left: 1px solid var(--diffs-bg);
      }

      [data-content] {
        grid-column: 4;
      }
    }
  }

  [data-overflow='scroll'] [data-gutter] {
    position: sticky;
    left: 0;
  }

  [data-line-annotation][data-selected-line] {
    background-color: unset;

    &::before {
      content: '';
      /* FIXME(amadeus): This needs to be audited ... */
      position: sticky;
      top: 0;
      left: 0;
      display: block;
      border-right: var(--diffs-gap-style, 1px solid var(--diffs-bg));
      background-color: var(--diffs-bg-selection-number);
    }

    [data-annotation-content] {
      background-color: var(--diffs-bg-selection);
    }
  }

  [data-interactive-lines] [data-line] {
    cursor: pointer;
  }

  [data-content-buffer],
  [data-gutter-buffer] {
    position: relative;
    -webkit-user-select: none;
            user-select: none;
    min-height: 1lh;
  }

  [data-gutter-buffer='annotation'] {
    min-height: 0;
  }

  [data-gutter-buffer='buffer'] {
    background-size: 8px 8px;
    background-position: 0 0;
    background-origin: border-box;
    background-color: var(--diffs-bg);
    /* This is incredibley expensive... */
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent calc(3px * 1.414),
      rgb(from var(--diffs-bg-buffer) r g b / 0.8) calc(3px * 1.414),
      rgb(from var(--diffs-bg-buffer) r g b / 0.8) calc(4px * 1.414)
    );
  }

  [data-content-buffer] {
    grid-column: 1;
    /* We multiply by 1.414 (√2) to better approximate the diagonal repeat distance */
    background-size: 8px 8px;
    background-position: 5px 0;
    background-origin: border-box;
    background-color: var(--diffs-bg);
    /* This is incredibley expensive... */
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent calc(3px * 1.414),
      var(--diffs-bg-buffer) calc(3px * 1.414),
      var(--diffs-bg-buffer) calc(4px * 1.414)
    );
  }

  [data-separator] {
    box-sizing: content-box;
    background-color: var(--diffs-bg);
  }

  [data-separator='simple'] {
    min-height: 4px;
  }

  [data-separator='line-info'],
  [data-separator='line-info-basic'],
  [data-separator='metadata'],
  [data-separator='simple'] {
    background-color: var(--diffs-bg-separator);
  }

  [data-separator='line-info'],
  [data-separator='line-info-basic'],
  [data-separator='metadata'] {
    height: 32px;
    position: relative;
  }

  [data-separator-wrapper] {
    -webkit-user-select: none;
            user-select: none;
    fill: currentColor;
    position: absolute;
    inset-inline: 0;
    display: flex;
    align-items: center;
    background-color: var(--diffs-bg);
    height: 100%;
  }

  [data-content] [data-separator-wrapper] {
    display: none;
  }

  [data-separator='metadata'] [data-separator-wrapper] {
    inset-inline: 100% auto;
    padding-inline: 1ch;
    height: 100%;
    background-color: var(--diffs-bg-separator);
    color: var(--diffs-fg-number);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: min-content;
  }

  [data-separator='line-info'] {
    margin-block: var(--diffs-gap-block, var(--diffs-gap-fallback));
  }

  [data-separator='line-info-basic'],
  [data-separator='metadata'] {
    margin-block: 0;
  }

  [data-separator='line-info'][data-separator-first] {
    margin-top: 0;
  }

  [data-separator='line-info'][data-separator-last] {
    margin-bottom: 0;
  }

  [data-expand-index] [data-separator-wrapper] {
    display: grid;
    grid-template-columns: 32px auto;
  }

  [data-expand-index] [data-separator-wrapper][data-separator-multi-button] {
    grid-template-columns: 32px 32px auto;
  }

  [data-expand-button],
  [data-separator-content] {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    background-color: var(--diffs-bg-separator);
  }

  [data-expand-index] [data-separator-content]:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  [data-expand-button] {
    justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    min-width: 32px;
    align-self: stretch;
    color: var(--diffs-fg-number);
    border-right: 2px solid var(--diffs-bg);

    &:hover {
      color: var(--diffs-fg);
    }

    &[data-expand-all-button] {
      display: none;
    }
  }

  [data-expand-down] [data-icon] {
    transform: scaleY(-1);
  }

  [data-separator-content] {
    flex: 1 1 auto;
    padding: 0 1ch;
    height: 100%;
    color: var(--diffs-fg-number);

    overflow: hidden;
    justify-content: flex-start;
  }

  [data-separator='line-info'],
  [data-separator='line-info-basic'] {
    [data-separator-content] {
      height: 100%;
      -webkit-user-select: none;
              user-select: none;
      overflow: clip;
    }
  }

  @supports (width: 1cqi) {
    [data-unified] {
      [data-separator='line-info'] [data-separator-wrapper] {
        padding-inline: var(--diffs-gap-inline, var(--diffs-gap-fallback));
        width: 100cqi;

        [data-separator-content] {
          border-radius: 6px;
        }
      }

      [data-separator='line-info'][data-expand-index]
        [data-separator-wrapper]
        [data-separator-content] {
        border-top-left-radius: unset;
        border-bottom-left-radius: unset;
      }
    }

    [data-gutter] {
      [data-separator='line-info'] [data-separator-wrapper] {
        padding-left: var(--diffs-gap-inline, var(--diffs-gap-fallback));
      }

      [data-separator='line-info'] [data-separator-content] {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }

      [data-separator='line-info'][data-expand-index] [data-separator-content] {
        border-top-left-radius: unset;
        border-bottom-left-radius: unset;
      }
    }

    [data-additions] {
      [data-content] [data-separator='line-info'] {
        background-color: var(--diffs-bg);

        [data-separator-wrapper] {
          display: none;
        }
      }

      [data-gutter] [data-separator='line-info'] [data-separator-wrapper] {
        display: block;
        height: 100%;
        background-color: var(--diffs-bg-separator);
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;

        [data-separator-content],
        [data-expand-button] {
          display: none;
        }
      }
    }

    [data-overflow='scroll']
      [data-additions]
      [data-gutter]
      [data-separator='line-info']
      [data-separator-wrapper] {
      width: calc(100cqi - var(--diffs-gap-inline, var(--diffs-gap-fallback)));
    }

    [data-overflow='wrap']
      [data-additions]
      [data-content]
      [data-separator='line-info']
      [data-separator-wrapper] {
      background-color: var(--diffs-bg-separator);
      display: block;
      height: 100%;
      margin-right: var(--diffs-gap-inline, var(--diffs-gap-fallback));
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;

      [data-separator-content],
      [data-expand-button] {
        display: none;
      }
    }

    [data-separator='line-info'] [data-separator-wrapper] {
      [data-expand-both],
      [data-expand-down],
      [data-expand-up] {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
      }
    }

    @media (pointer: fine) {
      [data-separator='line-info'] [data-separator-wrapper] {
        &[data-separator-multi-button] {
          [data-expand-up] {
            border-top-left-radius: 6px;
            border-bottom-left-radius: unset;
          }

          [data-expand-down] {
            border-bottom-left-radius: 6px;
            border-top-left-radius: unset;
          }
        }
      }
    }
  }

  @media (pointer: coarse) {
    [data-separator='line-info-basic']
      [data-separator-wrapper][data-separator-multi-button] {
      grid-template-columns: 34px 34px auto;

      [data-separator-content] {
        grid-column: unset;
        grid-row: unset;
      }
    }

    @supports (width: 1cqi) {
      [data-separator='line-info'] [data-separator-wrapper] {
        [data-expand-both],
        [data-expand-down],
        [data-expand-up] {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
        }

        &[data-separator-multi-button] {
          [data-expand-up] {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }

          [data-expand-down] {
            border-bottom-left-radius: unset;
            border-top-left-radius: unset;
          }
        }
      }
    }
  }

  @media (pointer: fine) {
    [data-separator-wrapper][data-separator-multi-button] {
      display: grid;
      grid-template-rows: 50% 50%;

      [data-separator-content] {
        grid-column: 2;
        grid-row: 1 / -1;
        min-width: min-content;
      }

      [data-expand-button] {
        grid-column: 1;
      }
    }

    [data-separator='line-info'] [data-separator-wrapper],
    [data-separator='line-info']
      [data-separator-wrapper][data-separator-multi-button] {
      grid-template-columns: 34px auto;
    }

    [data-separator='line-info-basic'][data-expand-index]
      [data-separator-wrapper] {
      grid-template-columns: 100% auto;
    }

    [data-separator='line-info'],
    [data-separator='line-info-basic'] {
      [data-separator-multi-button] {
        [data-expand-up] {
          border-bottom: 1px solid var(--diffs-bg);
          border-right: 2px solid var(--diffs-bg);
        }
        [data-expand-down] {
          border-top: 1px solid var(--diffs-bg);
          border-right: 2px solid var(--diffs-bg);
        }
      }
    }
  }

  [data-additions] [data-gutter] [data-separator-wrapper],
  [data-additions] [data-separator='line-info-basic'] [data-separator-wrapper],
  [data-content] [data-separator-wrapper] {
    display: none;
  }

  [data-line-annotation],
  [data-gutter-buffer='annotation'] {
    --diffs-line-bg: var(--diffs-bg-context);
  }

  [data-merge-conflict-actions],
  [data-gutter-buffer='merge-conflict-action'] {
    --diffs-line-bg: var(--diffs-bg-context);
  }

  [data-has-merge-conflict] [data-line-annotation],
  [data-has-merge-conflict] [data-gutter-buffer='annotation'] {
    --diffs-line-bg: var(--diffs-bg);
  }

  [data-has-merge-conflict] [data-gutter-buffer='merge-conflict-action'] {
    --diffs-line-bg: var(--diffs-bg);
  }

  [data-line-annotation] {
    min-height: var(--diffs-annotation-min-height, 0);
    z-index: 2;
  }

  [data-merge-conflict-actions] {
    z-index: 2;
  }

  [data-separator='custom'] {
    display: grid;
    grid-template-columns: subgrid;
  }

  [data-line],
  [data-column-number],
  [data-no-newline] {
    position: relative;
    padding-inline: 1ch;
  }

  [data-indicators='classic'] [data-line] {
    padding-inline-start: 2ch;
  }

  [data-indicators='classic'] {
    [data-line-type='change-addition'],
    [data-line-type='change-deletion'] {
      &[data-no-newline],
      &[data-line] {
        &::before {
          display: inline-block;
          width: 1ch;
          height: 1lh;
          position: absolute;
          top: 0;
          left: 0;
          -webkit-user-select: none;
                  user-select: none;
        }
      }
    }

    [data-line-type='change-addition'] {
      &[data-line],
      &[data-no-newline] {
        &::before {
          content: '+';
          color: var(--diffs-addition-base);
        }
      }
    }

    [data-line-type='change-deletion'] {
      &[data-line],
      &[data-no-newline] {
        &::before {
          content: '-';
          color: var(--diffs-deletion-base);
        }
      }
    }
  }

  [data-indicators='bars'] {
    [data-line-type='change-deletion'],
    [data-line-type='change-addition'] {
      &[data-column-number] {
        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          -webkit-user-select: none;
                  user-select: none;
          contain: strict;
        }
      }
    }

    [data-line-type='change-deletion'] {
      &[data-column-number] {
        &::before {
          background-image: linear-gradient(
            0deg,
            var(--diffs-bg-deletion) 50%,
            var(--diffs-deletion-base) 50%
          );
          background-repeat: repeat;
          background-size: 2px 2px;
          background-size: calc(1lh / round(1lh / 2px))
            calc(1lh / round(1lh / 2px));
        }
      }
    }

    [data-line-type='change-addition'] {
      &[data-column-number] {
        &::before {
          background-color: var(--diffs-addition-base);
        }
      }
    }
  }

  [data-overflow='wrap'] {
    [data-line],
    [data-annotation-content] {
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  [data-overflow='scroll'] [data-line] {
    white-space: pre;
    min-height: 1lh;
  }

  [data-column-number] {
    box-sizing: content-box;
    text-align: right;
    -webkit-user-select: none;
            user-select: none;
    background-color: var(--diffs-bg);
    color: var(--diffs-fg-number);
    padding-left: 2ch;
  }

  [data-line-number-content] {
    display: inline-block;
    min-width: var(
      --diffs-min-number-column-width,
      var(--diffs-min-number-column-width-default, 3ch)
    );
  }

  [data-disable-line-numbers] {
    [data-column-number] {
      min-width: 4px;
      padding: 0;
    }

    [data-line-number-content] {
      display: none;
    }

    [data-gutter-utility-slot] {
      right: unset;
      left: 0;
      justify-content: flex-start;
    }

    &[data-indicators='bars'] [data-gutter-utility-slot] {
      /* Using 5px here because theres a 1px separator after the bar */
      left: 5px;
    }
  }

  [data-file][data-disable-line-numbers] {
    [data-gutter-buffer],
    [data-column-number] {
      min-width: 0;
      border-right: 0;
    }
  }

  [data-interactive-line-numbers] [data-column-number] {
    cursor: pointer;
  }

  [data-diff-span] {
    border-radius: 3px;
    -webkit-box-decoration-break: clone;
            box-decoration-break: clone;
  }

  [data-line-type='change-addition'] {
    &[data-column-number] {
      color: var(
        --diffs-fg-number-addition-override,
        var(--diffs-addition-base)
      );
    }

    [data-diff-span] {
      background-color: var(--diffs-bg-addition-emphasis);
    }
  }

  [data-line-type='change-deletion'] {
    &[data-column-number] {
      color: var(
        --diffs-fg-number-deletion-override,
        var(--diffs-deletion-base)
      );
    }

    [data-diff-span] {
      background-color: var(--diffs-bg-deletion-emphasis);
    }
  }

  [data-background] [data-line-type='change-addition'] {
    --diffs-line-bg: var(--diffs-bg-addition);

    &[data-column-number] {
      background-color: var(--diffs-bg-addition-number);
    }
  }

  [data-background] [data-line-type='change-deletion'] {
    --diffs-line-bg: var(--diffs-bg-deletion);

    &[data-column-number] {
      background-color: var(--diffs-bg-deletion-number);
    }
  }

  [data-merge-conflict='marker-start'],
  [data-merge-conflict='marker-base'],
  [data-merge-conflict='marker-separator'],
  [data-merge-conflict='marker-end'] {
    padding-left: 1ch;
    color: var(--diffs-fg);
  }

  [data-merge-conflict='marker-start'],
  [data-merge-conflict='marker-end'] {
    display: flex;
    align-items: center;

    &::after {
      color: var(--diffs-fg-conflict-marker);
      font-style: normal;
      font-size: 0.75rem;
      line-height: 1.25rem;
      padding-left: 1ch;
      font-family: var(
        --diffs-header-font-family,
        var(--diffs-header-font-fallback)
      );
    }
  }

  [data-merge-conflict='marker-start']::after {
    content: '(Current Change)';
  }

  [data-merge-conflict='marker-end']::after {
    content: '(Incoming Change)';
  }

  [data-merge-conflict='marker-base'],
  [data-merge-conflict='marker-end'] {
    &[data-line],
    &[data-no-newline] {
      background-color: var(--diffs-bg-conflict-marker);
    }

    &[data-column-number] {
      background-color: var(--diffs-bg-conflict-marker-number);
      color: var(--diffs-fg-conflict-marker);

      [data-line-number-content] {
        color: var(--diffs-fg-conflict-marker);
      }
    }
  }

  [data-merge-conflict='current'] {
    &[data-line],
    &[data-no-newline] {
      background-color: var(--conflict-bg-current);
    }

    &[data-column-number] {
      background-color: var(--conflict-bg-current-number);
      color: var(--diffs-addition-base);
    }
  }

  [data-gutter-buffer='merge-conflict-marker-start'],
  [data-merge-conflict='marker-start'] {
    background-color: var(--conflict-bg-current-header);
  }

  [data-gutter-buffer='merge-conflict-marker-end'],
  [data-merge-conflict='marker-end'] {
    background-color: var(--conflict-bg-incoming-header);
  }

  [data-merge-conflict='marker-separator'] {
    &[data-line],
    &[data-no-newline] {
      background-color: var(--diffs-bg);
    }

    &[data-column-number] {
      background-color: var(--diffs-bg);
    }
  }

  [data-merge-conflict='base'] {
    &[data-line],
    &[data-no-newline] {
      background-color: var(--diffs-bg-conflict-base);
    }

    &[data-column-number] {
      background-color: var(--diffs-bg-conflict-base-number);
      color: var(--diffs-modified-base);
    }
  }

  [data-merge-conflict='incoming'] {
    &[data-line],
    &[data-no-newline] {
      background-color: var(--conflict-bg-incoming);
    }

    &[data-column-number] {
      background-color: var(--conflict-bg-incoming-number);
      color: var(--diffs-modified-base);
    }
  }

  @media (pointer: fine) {
    [data-column-number],
    [data-line] {
      &[data-hovered] {
        background-color: var(--diffs-bg-hover);
      }
    }

    [data-background] {
      [data-column-number],
      [data-line] {
        &[data-hovered] {
          &[data-line-type='change-deletion'] {
            background-color: var(--diffs-bg-deletion-hover);
          }

          &[data-line-type='change-addition'] {
            background-color: var(--diffs-bg-addition-hover);
          }
        }
      }
    }
  }

  [data-diffs-header='default'] {
    position: relative;
    background-color: var(--diffs-bg);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    min-height: calc(
      1lh + (var(--diffs-gap-block, var(--diffs-gap-fallback)) * 3)
    );
    padding-inline: 16px;
    top: 0;
    z-index: 2;
  }

  [data-header-content] {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--diffs-gap-inline, var(--diffs-gap-fallback));
    min-width: 0;
    white-space: nowrap;
  }

  [data-header-content] [data-prev-name],
  [data-header-content] [data-title] {
    direction: rtl;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    white-space: nowrap;
  }

  [data-prev-name] {
    opacity: 0.7;
  }

  [data-rename-icon] {
    fill: currentColor;
    flex-shrink: 0;
    flex-grow: 0;
  }

  [data-diffs-header='default'] [data-metadata] {
    display: flex;
    align-items: center;
    gap: 1ch;
    white-space: nowrap;
  }

  [data-diffs-header='default'] [data-additions-count] {
    font-family: var(--diffs-font-family, var(--diffs-font-fallback));
    color: var(--diffs-addition-base);
  }

  [data-diffs-header='default'] [data-deletions-count] {
    font-family: var(--diffs-font-family, var(--diffs-font-fallback));
    color: var(--diffs-deletion-base);
  }

  [data-annotation-content] {
    position: relative;
    display: flow-root;
    align-self: flex-start;
    z-index: 2;
    min-width: 0;
    isolation: isolate;
  }

  [data-merge-conflict-actions-content] {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding-inline: 0.5rem;
    min-height: 1.75rem;
    font-family: var(
      --diffs-header-font-family,
      var(--diffs-header-font-fallback)
    );
    font-size: 0.75rem;
    line-height: 1.2;
    color: var(--diffs-fg);
  }

  [data-merge-conflict-action] {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--diffs-fg-number);
    font: inherit;
    font-style: normal;
    cursor: pointer;
    padding: 0;
  }

  [data-merge-conflict-action]:hover {
    color: var(--diffs-fg);
  }

  [data-merge-conflict-action='current']:hover {
    color: var(--diffs-addition-base);
  }

  [data-merge-conflict-action='incoming']:hover {
    color: var(--diffs-modified-base);
  }

  [data-merge-conflict-action-separator] {
    color: var(--diffs-fg-number);
    opacity: 0.6;
    -webkit-user-select: none;
            user-select: none;
  }

  /* Sticky positioning has a composite costs, so we should _only_ pay it if we
   * need to */
  [data-overflow='scroll'] [data-annotation-content] {
    position: sticky;
    width: var(--diffs-column-content-width, auto);
    left: var(--diffs-column-number-width, 0);
  }

  [data-overflow='scroll'] [data-merge-conflict-actions-content] {
    position: sticky;
    width: var(--diffs-column-content-width, auto);
    left: var(--diffs-column-number-width, 0);
  }

  /* Undo some of the stuff that the 'pre' tag does */
  [data-annotation-slot] {
    text-wrap-mode: wrap;
    word-break: normal;
    white-space-collapse: collapse;
  }

  [data-change-icon] {
    fill: currentColor;
    flex-shrink: 0;
  }

  [data-change-icon='change'],
  [data-change-icon='rename-pure'],
  [data-change-icon='rename-changed'] {
    color: var(--diffs-modified-base);
  }

  [data-change-icon='new'] {
    color: var(--diffs-addition-base);
  }

  [data-change-icon='deleted'] {
    color: var(--diffs-deletion-base);
  }

  [data-change-icon='file'] {
    opacity: 0.6;
  }

  /* Line selection highlighting */
  [data-selected-line] {
    &[data-gutter-buffer='annotation'],
    &[data-column-number] {
      color: var(--diffs-selection-number-fg);
      background-color: var(--diffs-bg-selection-number);
    }

    &[data-line] {
      background-color: var(--diffs-bg-selection);
    }
  }

  [data-line-type='change-addition'],
  [data-line-type='change-deletion'] {
    &[data-selected-line] {
      &[data-line],
      &[data-line][data-hovered] {
        background-color: light-dark(
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 82%,
            var(--diffs-selection-base)
          ),
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 75%,
            var(--diffs-selection-base)
          )
        );
      }

      &[data-column-number],
      &[data-column-number][data-hovered] {
        color: var(--diffs-selection-number-fg);
        background-color: light-dark(
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 75%,
            var(--diffs-selection-base)
          ),
          color-mix(
            in lab,
            var(--diffs-line-bg, var(--diffs-bg)) 60%,
            var(--diffs-selection-base)
          )
        );
      }
    }
  }

  [data-gutter-utility-slot] {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
  }

  [data-unmodified-lines] {
    display: block;
    overflow: hidden;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 0 1 auto;
  }

  [data-error-wrapper] {
    overflow: auto;
    padding: var(--diffs-gap-block, var(--diffs-gap-fallback))
      var(--diffs-gap-inline, var(--diffs-gap-fallback));
    max-height: 400px;
    scrollbar-width: none;

    [data-error-message] {
      font-weight: bold;
      font-size: 18px;
      color: var(--diffs-deletion-base);
    }

    [data-error-stack] {
      color: var(--diffs-fg-number);
    }
  }

  [data-placeholder] {
    contain: strict;
  }

  [data-utility-button] {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    appearance: none;
    width: 1lh;
    height: 1lh;
    margin-right: calc((1lh - 1ch) * -1);
    padding: 0;
    cursor: pointer;
    font-size: var(--diffs-font-size, 13px);
    line-height: var(--diffs-line-height, 20px);
    border-radius: 4px;
    background-color: var(--diffs-modified-base);
    color: var(--diffs-bg);
    fill: currentColor;
    position: relative;
    z-index: 4;
  }
}
`,I=`@layer base, theme, rendered, unsafe;`;function Se(e){return`${I}
@layer unsafe {
  ${e}
}`}function Ce(e,t=`system`){return`${I}
@layer rendered {
  :host {${t===`system`?``:`
  color-scheme: ${t};`}
  ${e}
  }
}`}function we({code:e,pre:t,columnType:n,rowSpan:r,containerSize:i=!1}={}){return e??(e=document.createElement(`code`),e.setAttribute(`data-code`,``),n!=null&&e.setAttribute(`data-${n}`,``),t?.appendChild(e)),r==null?e.style.removeProperty(`grid-row`):e.style.setProperty(`grid-row`,`span ${r}`),i?e.setAttribute(`data-container-size`,``):e.removeAttribute(`data-container-size`),e}function Te(e,t){if(t==null)return;let n=e.shadowRoot??e.attachShadow({mode:`open`});n.innerHTML===``&&(n.innerHTML=t)}function Ee(e,{type:t,diffIndicators:n,disableBackground:r,disableLineNumbers:i,overflow:a,split:o,totalLines:s,customProperties:c}){if(c!=null)for(let t in c){let n=c[t];n!=null&&e.setAttribute(t,`${n}`)}switch(t===`diff`?(e.setAttribute(`data-diff`,``),e.removeAttribute(`data-file`)):(e.setAttribute(`data-file`,``),e.removeAttribute(`data-diff`)),n){case`bars`:case`classic`:e.setAttribute(`data-indicators`,n);break;case`none`:e.removeAttribute(`data-indicators`);break}return i?e.setAttribute(`data-disable-line-numbers`,``):e.removeAttribute(`data-disable-line-numbers`),r?e.removeAttribute(`data-background`):e.setAttribute(`data-background`,``),t===`diff`?e.setAttribute(`data-diff-type`,o?`split`:`single`):e.removeAttribute(`data-diff-type`),e.setAttribute(`data-overflow`,a),e.tabIndex=0,e.style.setProperty(`--diffs-min-number-column-width-default`,`${`${s}`.length}ch`),e}function De({shadowRoot:e,currentNode:t,themeCSS:n}){if(n.trim()===``){t?.remove();return}return t??=Oe(),t.textContent=n,t.parentNode!==e&&e.appendChild(t),t}function Oe(){let e=document.createElement(`style`);return e.setAttribute(a,``),e}if(typeof HTMLElement<`u`&&customElements.get(`diffs-container`)==null){let e;class t extends HTMLElement{constructor(){if(super(),this.shadowRoot!=null)return;let t=this.attachShadow({mode:`open`});e??(e=new CSSStyleSheet,e.replaceSync(xe)),t.adoptedStyleSheets=[e]}}customElements.define(o,t)}var L=new Set,R=new Set,z=null,B=!1;function V(e){if(B){L.add(e);return}R.add(e),z??=requestAnimationFrame(H)}function H(e){B=!0;for(let t of R)try{t(e)}catch(e){console.error(e)}R.clear(),L.size>0?(R=new Set(L),L.clear(),z=requestAnimationFrame(H)):z=null,B=!1}function U(e,t){return e==null||t==null?e===t:e.top===t.top&&e.bottom===t.bottom}function W({scrollTop:e,scrollHeight:t,height:n,containerOffset:r=0,fitPerfectly:i,overscrollSize:a}){let o=n+a*2,s=i?n:o;if(t=Math.max(t,s),o>=t||i){let n=Math.max(e-r,0),i=Math.min(e+s,t)-r;return{top:n,bottom:Math.max(i,n)}}let c=e+n/2-o/2,l=c+o;return c<0&&(c=0),l>t&&(l=t),c=Math.floor(Math.max(c-r,0)),{top:c,bottom:Math.ceil(Math.max(Math.min(l,t)-r,c))}}var G=1e3,ke=G*4,Ae=[0,1e-6,.99999,1],je={overscrollSize:G,intersectionObserverMargin:ke,resizeDebugging:!1},K=0,Me=-1,Ne=class e{static __STOP=!1;static __lastScrollPosition=0;__id=`virtualizer-${++Me}`;config;type=`basic`;intersectionObserver;scrollTop=0;height=0;scrollHeight=0;windowSpecs={top:0,bottom:0};root;contentContainer;resizeObserver;observers=new Map;visibleInstances=new Map;visibleInstancesDirty=!1;instancesChanged=new Set;scrollDirty=!0;heightDirty=!0;scrollHeightDirty=!0;renderedObservers=0;connectQueue=new Map;constructor(e){this.config={...je,...e}}setup(t,n){if(this.root==null){this.root=t,this.resizeObserver=new ResizeObserver(this.handleContainerResize),this.intersectionObserver=new IntersectionObserver(this.handleIntersectionChange,{root:this.root,threshold:Ae,rootMargin:`${this.config.intersectionObserverMargin}px 0px ${this.config.intersectionObserverMargin}px 0px`}),t instanceof Document?this.setupWindow():this.setupElement(n),window.__INSTANCE=this,window.__TOGGLE=()=>{e.__STOP?(e.__STOP=!1,(this.getScrollContainerElement()??window).scrollTo({top:e.__lastScrollPosition}),V(this.computeRenderRangeAndEmit)):(e.__lastScrollPosition=this.getScrollTop(),e.__STOP=!0)};for(let[e,t]of this.connectQueue.entries())this.connect(e,t);this.connectQueue.clear(),this.markDOMDirty(),V(this.computeRenderRangeAndEmit)}}instanceChanged(e){this.instancesChanged.add(e),this.markDOMDirty(),V(this.computeRenderRangeAndEmit)}getWindowSpecs(){return this.windowSpecs.top===0&&this.windowSpecs.bottom===0&&(this.windowSpecs=W({scrollTop:this.getScrollTop(),height:this.getHeight(),scrollHeight:this.getScrollHeight(),fitPerfectly:!1,overscrollSize:this.config.overscrollSize})),this.windowSpecs}isInstanceVisible(e,t){let n=this.getScrollTop(),r=this.getHeight(),i=this.config.intersectionObserverMargin,a=n-i,o=n+r+i;return!(e<a-t||e>o)}handleContainerResize=e=>{if(this.root==null)return;let t=!1;for(let n of e){let e=n.borderBoxSize[0].blockSize;this.root instanceof Document?e!==this.scrollHeight&&(this.scrollHeightDirty=!0,t=!0,this.config.resizeDebugging&&(console.log(`Virtualizer: content size change`,this.__id,{sizeChange:e-K,newSize:e}),K=e)):n.target===this.root?e!==this.height&&(this.heightDirty=!0,t=!0):n.target===this.contentContainer&&(this.scrollHeightDirty=!0,t=!0,this.config.resizeDebugging&&(console.log(`Virtualizer: scroller size change`,this.__id,{sizeChange:e-K,newSize:e}),K=e))}t&&V(this.computeRenderRangeAndEmit)};setupWindow(){if(this.root==null||!(this.root instanceof Document))throw Error(`Virtualizer.setupWindow: Invalid setup method`);window.addEventListener(`scroll`,this.handleWindowScroll,{passive:!0}),window.addEventListener(`resize`,this.handleWindowResize,{passive:!0}),this.resizeObserver?.observe(this.root.documentElement)}setupElement(e){if(this.root==null||this.root instanceof Document)throw Error(`Virtualizer.setupElement: Invalid setup method`);this.root.addEventListener(`scroll`,this.handleElementScroll,{passive:!0}),this.resizeObserver?.observe(this.root),e??=this.root.firstElementChild??void 0,e instanceof HTMLElement&&(this.contentContainer=e,this.resizeObserver?.observe(e))}cleanUp(){this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.root?.removeEventListener(`scroll`,this.handleElementScroll),window.removeEventListener(`scroll`,this.handleWindowScroll),window.removeEventListener(`resize`,this.handleWindowResize),this.root=void 0,this.contentContainer=void 0,this.observers.clear(),this.visibleInstances.clear(),this.instancesChanged.clear(),this.connectQueue.clear(),this.visibleInstancesDirty=!1,this.windowSpecs={top:0,bottom:0},this.scrollTop=0,this.height=0,this.scrollHeight=0}getOffsetInScrollContainer(e){return this.getScrollTop()+q(e,this.getScrollContainerElement())}connect(e,t){if(this.observers.has(e))throw Error(`Virtualizer.connect: instance is already connected...`);return this.intersectionObserver==null?this.connectQueue.set(e,t):(this.intersectionObserver.observe(e),this.observers.set(e,t),this.instancesChanged.add(t),this.markDOMDirty(),V(this.computeRenderRangeAndEmit)),()=>this.disconnect(e)}disconnect(e){let t=this.observers.get(e);this.connectQueue.delete(e),t!=null&&(this.intersectionObserver?.unobserve(e),this.observers.delete(e),this.visibleInstances.delete(e)&&(this.visibleInstancesDirty=!0),this.markDOMDirty(),V(this.computeRenderRangeAndEmit))}handleWindowResize=()=>{e.__STOP||window.innerHeight===this.height||(this.heightDirty=!0,V(this.computeRenderRangeAndEmit))};handleWindowScroll=()=>{e.__STOP||this.root==null||!(this.root instanceof Document)||(this.scrollDirty=!0,V(this.computeRenderRangeAndEmit))};handleElementScroll=()=>{e.__STOP||this.root==null||this.root instanceof Document||(this.scrollDirty=!0,V(this.computeRenderRangeAndEmit))};computeRenderRangeAndEmit=()=>{if(e.__STOP)return;let t=this.heightDirty||this.scrollHeightDirty;if(!this.scrollDirty&&!this.scrollHeightDirty&&!this.heightDirty&&this.renderedObservers===this.observers.size&&!this.visibleInstancesDirty&&this.instancesChanged.size===0)return;if(this.instancesChanged.size===0){let e=W({scrollTop:this.getScrollTop(),height:this.getHeight(),scrollHeight:this.getScrollHeight(),fitPerfectly:!1,overscrollSize:this.config.overscrollSize});if(U(this.windowSpecs,e)&&this.renderedObservers===this.observers.size&&!this.visibleInstancesDirty&&this.instancesChanged.size===0)return;this.windowSpecs=e}this.visibleInstancesDirty=!1,this.renderedObservers=this.observers.size;let n=this.getScrollAnchor(this.height),r=new Set;for(let e of t?this.observers.values():this.visibleInstances.values())e.onRender(t)&&r.add(e);for(let e of this.instancesChanged)r.has(e)||e.onRender(t)&&r.add(e);this.scrollFix(n),this.instancesChanged.size>0&&this.markDOMDirty();for(let e of r)e.reconcileHeights();(this.instancesChanged.size>0||t)&&V(this.computeRenderRangeAndEmit),r.clear(),this.instancesChanged.clear()};scrollFix(e){if(e==null)return;let t=this.getScrollContainerElement(),{lineIndex:n,lineOffset:r,fileElement:i,fileOffset:a,fileTypeOffset:o}=e;if(n!=null&&r!=null){let e=i.shadowRoot?.querySelector(`[data-line][data-line-index="${n}"]`);if(e instanceof HTMLElement){let n=q(e,t);if(n!==r){let e=n-r;this.applyScrollFix(e)}return}}let s=q(i,t);if(o===`top`)s!==a&&this.applyScrollFix(s-a);else{let e=s+i.getBoundingClientRect().height;e!==a&&this.applyScrollFix(e-a)}}applyScrollFix(e){this.root==null||this.root instanceof Document?window.scrollTo({top:window.scrollY+e,behavior:`instant`}):this.root.scrollTo({top:this.root.scrollTop+e,behavior:`instant`}),this.markDOMDirty()}getScrollAnchor(e){let t=this.getScrollContainerElement(),n;for(let[r]of this.visibleInstances.entries()){let i=q(r,t),a=i+r.offsetHeight,o,s;a<=0?(o=a,s=`bottom`):(o=i,s=`top`);let c,l;if(a>0&&i<e)for(let e of r.shadowRoot?.querySelectorAll(`[data-line][data-line-index]`)??[]){if(!(e instanceof HTMLElement))continue;let n=e.dataset.lineIndex;if(n==null)continue;let r=q(e,t);if(!(r<0)){c=n,l=r;break}}if(n?.lineOffset!=null&&l==null)continue;let u=!1;(n==null||l!=null&&(n.lineOffset==null||l<n.lineOffset)||l==null&&n.lineOffset==null&&(o>=0&&(n.fileOffset<0||o<n.fileOffset)||o<0&&n.fileOffset<0&&o>n.fileOffset))&&(u=!0),u&&(n={fileElement:r,fileTypeOffset:s,fileOffset:o,lineIndex:c,lineOffset:l})}return n}handleIntersectionChange=e=>{this.scrollDirty=!0;for(let{target:t,isIntersecting:n}of e){if(!(t instanceof HTMLElement))throw Error(`Virtualizer.handleIntersectionChange: target not an HTMLElement`);let e=this.observers.get(t);if(e==null)throw Error(`Virtualizer.handleIntersectionChange: no instance for target`);n&&!this.visibleInstances.has(t)?(e.setVisibility(!0),this.visibleInstances.set(t,e),this.visibleInstancesDirty=!0):!n&&this.visibleInstances.has(t)&&(e.setVisibility(!1),this.visibleInstances.delete(t),this.visibleInstancesDirty=!0)}this.visibleInstancesDirty&&V(this.computeRenderRangeAndEmit)};getScrollTop(){if(!this.scrollDirty)return this.scrollTop;this.scrollDirty=!1;let e=this.root==null?0:this.root instanceof Document?window.scrollY:this.root.scrollTop;return e=Math.max(0,Math.min(e,this.getScrollHeight()-this.getHeight())),this.scrollTop=e,e}getScrollHeight(){return this.scrollHeightDirty?(this.scrollHeightDirty=!1,this.scrollHeight=this.root==null?0:this.root instanceof Document?this.root.documentElement.scrollHeight:this.root.scrollHeight,this.scrollHeight):this.scrollHeight}getHeight(){return this.heightDirty?(this.heightDirty=!1,this.height=this.root==null?0:this.root instanceof Document?globalThis.innerHeight:this.root.getBoundingClientRect().height,this.height):this.height}markDOMDirty(){this.scrollDirty=!0,this.scrollHeightDirty=!0,this.heightDirty=!0}getScrollContainerElement(){return this.root==null||this.root instanceof Document?void 0:this.root}};function q(e,t){let n=e.getBoundingClientRect(),r=t?.getBoundingClientRect().top??0;return n.top-r}function J(e,t,n){if(e===t||e==null||t==null)return e===t;let r=new Set(n),i=Object.keys(e),a=new Set(Object.keys(t));for(let n of i)if(a.delete(n),!r.has(n)&&(!(n in t)||e[n]!==t[n]))return!1;for(let e of Array.from(a))if(!r.has(e))return!1;return!0}function Pe(e,t){let n=e?.theme??c,r=t?.theme??c,i=Y(e),a=Y(t);return h(n,r)&&J(e,t,[`theme`,`parseDiffOptions`])&&J(i,a)}function Y(e){if(e!=null&&`parseDiffOptions`in e)return e.parseDiffOptions}var Fe={position:`absolute`,top:0,bottom:0,textAlign:`center`},Ie={display:`contents`};function Le(){return null}var X=n();function Re(e,t){return typeof window>`u`&&t!=null?(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)(`template`,{shadowrootmode:`open`,dangerouslySetInnerHTML:{__html:t}}),e]}):(0,X.jsx)(X.Fragment,{children:e})}var Z=e(t(),1),Q=(0,Z.createContext)(void 0);function ze(){return(0,Z.useContext)(Q)}function Be(e){let t=(0,Z.useRef)(e);return(0,Z.useInsertionEffect)(()=>void(t.current=e)),(0,Z.useCallback)((...e)=>t.current(...e),[])}var $=`var(--color-token-main-surface-primary)`,Ve=`var(--color-token-diff-surface)`,He=`
  --codex-diffs-surface: ${$};
  --codex-diffs-context-surface: color-mix(
  in srgb,
  var(--codex-diffs-surface) 94%,
  var(--color-token-main-surface-primary)
);
  --codex-diffs-separator-surface: color-mix(
  in srgb,
  var(--codex-diffs-surface) 94%,
  var(--color-token-text-link-foreground)
);
  --codex-diffs-hover-surface: color-mix(
  in srgb,
  var(--codex-diffs-surface) 92%,
  var(--color-token-main-surface-primary)
);
  --codex-diffs-header-surface: var(--codex-diffs-surface);
  --codex-diffs-context-number: color-mix(
  in lab,
  var(--codex-diffs-surface) 98.5%,
  var(--diffs-mixer)
);
  --codex-diffs-addition-number: color-mix(
  in srgb,
  var(--codex-diffs-surface) 91%,
  var(--diffs-addition-color-override)
);
  --codex-diffs-deletion-number: color-mix(
  in srgb,
  var(--codex-diffs-surface) 91%,
  var(--diffs-deletion-color-override)
);
  --diffs-bg-context-override: var(--codex-diffs-context-surface);
  --diffs-bg-separator-override: var(--codex-diffs-separator-surface);
  --diffs-bg-hover-override: var(--codex-diffs-hover-surface);
  --diffs-bg-addition-override: color-mix(
  in srgb,
  var(--codex-diffs-surface) 88%,
  var(--diffs-addition-color-override)
);
  --diffs-bg-addition-number-override: var(--codex-diffs-addition-number);
  --diffs-bg-deletion-override: color-mix(
  in srgb,
  var(--codex-diffs-surface) 88%,
  var(--diffs-deletion-color-override)
);
  --diffs-bg-deletion-number-override: var(--codex-diffs-deletion-number);
`;function Ue({includeDiffHeader:e,includeSimpleLineSeparators:t,rootSelector:n,surface:r}){return`
  ${e?`[data-diffs-header],
  ${n}`:n} {
    ${He}
    --diffs-bg: ${r} !important;
    background-color: ${r} !important;
  }

  ${n} [data-utility-button] {
    background-color: var(--color-token-foreground);
    color: var(--color-token-side-bar-background);
    border: none;
    border-radius: 4px;
    margin-right: 0;
  }

  ${n} [data-utility-button]:hover {
    background-color: color-mix(
      in srgb,
      var(--color-token-foreground) 88%,
      var(--color-token-side-bar-background)
    );
  }

  ${n} [data-selected-line][data-line-annotation] {
    background-color: var(--diffs-bg);
  }

  mark.codex-thread-find-match {
    background-color: var(--vscode-charts-yellow);
    color: var(--color-token-foreground);
    border-radius: var(--radius-2xs);
    padding: 0;
    margin: 0;
    border: 0;
    font: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    word-spacing: inherit;
    vertical-align: baseline;
  }

  mark.codex-thread-find-active {
    background-color: var(--vscode-charts-orange);
  }
${t?`
  :host(.composer-diff-simple-line) [data-separator]:empty {
    background-color: transparent;
  }

  :host(.composer-diff-simple-line) [data-separator]:empty::after {
    content: "";
    grid-column: 2 / 3;
    align-self: center;
    margin-inline: 1ch;
    border-top: 1px solid color-mix(in srgb, var(--diffs-fg) 18%, transparent);
  }
`:``}`}function We(e,t){return e?t===`diff`?Ve:$:`var(--color-token-side-bar-background)`}export{oe as A,_e as C,fe as D,me as E,S as F,ie as M,j as N,le as O,x as P,ve as S,he as T,Se as _,ze as a,F as b,Ie as c,Ne as d,De as f,Ce as g,we as h,Q as i,ae as j,se as k,Le as l,Te as m,Ue as n,Re as o,Ee as p,Be as r,Fe as s,We as t,Pe as u,be as v,ge as w,M as x,ye as y};
//# sourceMappingURL=codex-diff-css-BhJWhA87.js.map