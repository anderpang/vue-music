<template>
  <div class="music-player">
    <header-bar :isSearch="false" :title="headerTitle" :right="headerRight"></header-bar>

    <main class="music-lrc">        	  
	</main>
	<footer class="music-footer">
	 <div class="music-progress"><span class="progress-bar"><i class="progress-dot"></i></span></div> 
	 <div class="music-time"><span>00:00</span><span class="r">00:00</span></div>
	 <div class="music-btn-wrap">
	   <i class="msc-icon msc-circ-btn" title="顺序播放"></i>
	   <i class="msc-icon msc-prev-btn" title="上一首"></i>
	   <i class="msc-icon msc-play-btn" title="暂停"></i>
	   <i class="msc-icon msc-next-btn" title="下一首"></i>	   	   
	   <i class="msc-icon msc-list-btn" title="播放列表" @click="showPlayLists()"></i>	   
	 </div>
    </footer>
    
    <transition name="slide-up">
       <play-lists v-if="showLists" @close-click="hidePlayLists"></play-lists>
    </transition>
	<!--i class="music-i" style="background-image:none"></i-->
  </div>
</template>

<style>
    .music-player{display:flex;position:fixed;left:0;top:0;z-index:99;width:100%;height:100%;flex-direction:column;color:#FFF;background:#2F2D3B;-webkit-transition:-webkit-transform 1s ease-in-out;transition:transform 1s ease-in-out;-webkit-transform:translateY(100%);transform:translateY(100%);}
    .music-player.fullscreen{-webkit-transform:translateY(0);transform:translateY(0);}
    .music-player>.header{position:static;padding:1em 0;}
    .music-player>.header>.header-inner{padding:1em 3%;}
    .music-player .header-title{display:block;text-align:center;}
    .music-player .header-title>.f1s{width:100%;}
 
    .msc-icon{display:block;width:3vh;height:3vh;min-height:1.4em;min-width:1.4em;background:url(data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEtZmxhdC0yMDAzMDExNC5kdGQiPjxzdmcgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTE1NTAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjQ0NDIj48cGF0aCBkPSJNODcuMjA1MDY4IDEwMjRWLTAuMDA3MjA4bDg4Ni44MjAzMyA1MTIuMDE0NDE2LTg4Ni44MjAzMyA1MTEuOTkyNzkyeiBtODYuNDk4NjYzLTg3NC4xODQzMTZWODc0LjE3NzEwOGw2MjcuMzI0MzQyLTM2Mi4xNjk5LTYyNy4zMjQzNDItMzYyLjE5MTUyNHoiPjwvcGF0aD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDEwNTApIj48cGF0aCBkPSJNNzk2LjQ0NCA1Ni44ODljLTMxLjYzIDAtNTYuODg5IDI1LjQ4Ni01Ni44ODkgNTYuOTQ2djc5Ni4zMzFjMCAzMS42ODcgMjUuNDI5IDU2Ljk0NiA1Ni44ODkgNTYuOTQ2IDMxLjYzIDAgNTYuODg5LTI1LjQ4NiA1Ni44ODktNTYuOTQ2di03OTYuMzMxYzAtMzEuNjMtMjUuNDI5LTU2Ljk0Ni01Ni44ODktNTYuOTQ2ek0yMjcuNTU2IDU2Ljg4OWMtMzEuNjMgMC01Ni44ODkgMjUuNDg2LTU2Ljg4OSA1Ni45NDZ2Nzk2LjMzMWMwIDMxLjY4NyAyNS40ODYgNTYuOTQ2IDU2Ljg4OSA1Ni45NDYgMzEuNjMgMCA1Ni44ODktMjUuNDg2IDU2Ljg4OS01Ni45NDZ2LTc5Ni4zMzFjMC0zMS42My0yNS40ODYtNTYuOTQ2LTU2Ljg4OS01Ni45NDZ6Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMjEwMCkiPjxwYXRoIGQ9Ik05MzAuODQ0MzYgOTc3LjM4MjYyMyA5MzAuODQ0MzYgNDYuNjE3Mzc3IDEwMDIuNjMwODEzIDg1LjcxMTM1IDI4Mi4wMzgzNjcgNTUxLjA5Mzk3NCAyODIuMDM4MzY3IDQ3Mi45MDYwMjYgMTAwMi42MzA4MTMgOTM4LjI4ODY0OSA5MzAuODQ0MzYgOTc3LjM4MjYyMyA5MzAuODQ0MzYgOTc3LjM4MjYyM1pNMTAyMy45MjA4ODUgOTc3LjM4MjYyM0MxMDIzLjkyMDg4NSAxMDE0LjI0NjIyNyA5ODMuMTAxMzEyIDEwMzYuNDc2MDM4IDk1Mi4xMzQ0MzIgMTAxNi40NzY1OTdMMjMxLjU0MTk4NCA1NTEuMDkzOTc0QzIwMy4xNTUyMjEgNTMyLjc2MDg1NCAyMDMuMTU1MjIxIDQ5MS4yMzkxNDYgMjMxLjU0MTk4NCA0NzIuOTA2MDI2TDk1Mi4xMzQ0MzIgNy41MjM0MDRDOTgzLjEwMTMxMi0xMi40NzYwMzkgMTAyMy45MjA4ODUgOS43NTM3NzEgMTAyMy45MjA4ODUgNDYuNjE3Mzc3TDEwMjMuOTIwODg1IDk3Ny4zODI2MjNaTTk3LjkwOTU0NiA5Mi43NzQxNzFDOTcuOTA5NTQ2IDY3LjI4MjQ3OCA3Ny4yNTI4NSA0Ni42MTczNzcgNTEuMzcxMjg0IDQ2LjYxNzM3NyAyNS42Njg5MTQgNDYuNjE3Mzc3IDQuODMzMDIyIDY3LjgwNjUwOCA0LjgzMzAyMiA5Mi43NzQxNzFMNC44MzMwMjIgOTMxLjIyNTgzQzQuODMzMDIyIDk1Ni43MTc1MjEgMjUuNDg5NzIzIDk3Ny4zODI2MjMgNTEuMzcxMjg0IDk3Ny4zODI2MjMgNzcuMDczNjU5IDk3Ny4zODI2MjMgOTcuOTA5NTQ2IDk1Ni4xOTM0OTEgOTcuOTA5NTQ2IDkzMS4yMjU4M0w5Ny45MDk1NDYgOTIuNzc0MTcxWiI+PC9wYXRoPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDMxNTApIj48cGF0aCBkPSJNOTMuMTU2IDQ2LjYxN3Y5MzAuNzY1bC03MS43ODYtMzkuMDk0IDcyMC41OTItNDY1LjM4M3Y3OC4xODhsLTcyMC41OTItNDY1LjM4MyA3MS43ODYtMzkuMDk0ek0wLjA3OSA0Ni42MTdjMC0zNi44NjQgNDAuODItNTkuMDkzIDcxLjc4Ni0zOS4wOTRsNzIwLjU5MiA0NjUuMzgzYzI4LjM4NyAxOC4zMzMgMjguMzg4IDU5Ljg1NSAwIDc4LjE4OGwtNzIwLjU5MiA0NjUuMzgzYy0zMC45NjcgMTkuOTk4LTcxLjc4Ni0yLjIzLTcxLjc4Ni0zOS4wOTR2LTkzMC43NjV6TTkyNi4wOTAgOTMxLjIyNmMwIDI1LjQ5MyAyMC42NTcgNDYuMTU3IDQ2LjUzOCA0Ni4xNTcgMjUuNzAyIDAgNDYuNTM4LTIxLjE4OSA0Ni41MzgtNDYuMTU3di04MzguNDUyYzAtMjUuNDkzLTIwLjY1Ny00Ni4xNTctNDYuNTM4LTQ2LjE1Ny0yNS43MDIgMC00Ni41MzggMjEuMTg5LTQ2LjUzOCA0Ni4xNTd2ODM4LjQ1MnoiPjwvcGF0aD48L2c+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCw0MjAwKSI+PHBhdGggZD0iTTgyOS42NzEgMzMwLjEzN2MtNDguNTc4LTQ4LjU3OC0xMTMuMTY1LTc1LjMzMS0xODEuODYzLTc1LjMzMUwzNzcuODg5IDI1NC44MDZsMC01MS42MzJjMC0xNi40OS0xMS4zMzQtMjIuNjYyLTI1LjE4Ni0xMy43MTZMMjI4LjQ0IDI2OS43MTNjLTEzLjg1MiA4Ljk0NS0xMy43MTcgMjMuMzcxIDAuMzAxIDMyLjA1NWwxMjMuNjYyIDc2LjYxYzE0LjAxOCA4LjY4NCAyNS40ODYgMi4yOTggMjUuNDg2LTE0LjE5MmwwLTUxLjM3OSAyNjkuOTE4IDBjMTA5LjgzNiAwIDE5OS4xOTMgODkuMzU4IDE5OS4xOTMgMTk5LjE5MyAwIDE4LjE2MS0yLjQzOCAzNi4xNDYtNy4yNDYgNTMuNDU0LTQuMjg3IDE1LjQzMiA0Ljc0NyAzMS40MTcgMjAuMTc5IDM1LjcwNCAyLjU5NyAwLjcyMiA1LjIwOSAxLjA2NiA3Ljc3OSAxLjA2NiAxMi43MDEgMCAyNC4zNTktOC40MSAyNy45MjUtMjEuMjQ1IDYuMjEzLTIyLjM2MyA5LjM2My00NS41NzEgOS4zNjMtNjguOTc5QzkwNS4wMDEgNDQzLjMwMSA4NzguMjQ4IDM3OC43MTQgODI5LjY3MSAzMzAuMTM3ek03ODEuNzg3IDcyMi4yMzJsLTEyMy42NjItNzYuNjFjLTE0LjAxOC04LjY4NC0yNS40ODYtMi4yOTgtMjUuNDg2IDE0LjE5MmwwIDUxLjM3OUwzNDEuMTk0IDcxMS4xOTNjLTEwOS44MzUgMC0xOTkuMTkzLTg5LjM1Ny0xOTkuMTkzLTE5OS4xOTMgMC0zOC40ODggMTAuOTg4LTc1LjgyOCAzMS43NzUtMTA3Ljk4MiA4LjY5Ni0xMy40NSA0Ljg0MS0zMS40MDMtOC42MDgtNDAuMDk4LTEzLjQ1MS04LjY5Ny0zMS40MDMtNC44NDEtNDAuMDk5IDguNjA5Qzk4LjIwMiA0MTQuMDg2IDg0LjAwMSA0NjIuMzE0IDg0LjAwMSA1MTJjMCA2OC42OTggMjYuNzUzIDEzMy4yODUgNzUuMzMgMTgxLjg2MyA0OC41NzggNDguNTc3IDExMy4xNjUgNzUuMzMgMTgxLjg2MyA3NS4zM2wyOTEuNDQ0IDAgMCA1MS42MzJjMCAxNi40OSAxMS4zMzQgMjIuNjYyIDI1LjE4NiAxMy43MTZsMTI0LjI2NC04MC4yNTRDNzk1LjkzOSA3NDUuMzQyIDc5NS44MDUgNzMwLjkxNiA3ODEuNzg3IDcyMi4yMzJ6Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsNTI1MCkiPjxwYXRoIGQ9Ik00ODAuODMyIDIyMS41NjggMzIwLjU3NiAyMjEuNTY4Yy04NC42MDggMC0xNjYuOTc2IDMzLjQwOC0yMjcuMDcyIDkzLjUwNFMwIDQ1NS4yOTYgMCA1NDIuMTQ0YzAgMjguOTI4IDQuNDggNTcuODU2IDExLjEzNiA4Ni44NDggNC40OCAxNS41NTIgMjAuMDMyIDI2LjY4OCAzNS42NDggMjYuNjg4IDIuMjQgMCA2LjY1NiAwIDguODk2LTIuMjQgMjAuMDMyLTQuNDggMzEuMTY4LTI0LjUxMiAyNC41MTItNDQuNTQ0QzczLjQ3MiA1ODYuNjg4IDcxLjIzMiA1NjQuNDE2IDcxLjIzMiA1NDIuMTQ0YzAtMTM4LjA0OCAxMTEuMjk2LTI0OS4zNDQgMjQ5LjM0NC0yNDkuMzQ0bDE0Ni45NDQgMEM0NjkuNjk2IDI2OC4zNTIgNDc0LjE3NiAyNDMuODQgNDgwLjgzMiAyMjEuNTY4ek04MDMuNjQ4IDYyNC41MTJjLTQwLjA2NCA4Mi4zNjgtMTI0LjY3MiAxNDAuMjI0LTIyMi41OTIgMTQwLjIyNEwyNDQuODY0IDc2NC43MzZsMC02NC41NzZjMC0yMC4wMzItMTMuMzc2LTI4LjkyOC0zMS4xNjgtMTcuNzkybC0xNTMuNiA5NS43NDRjLTE3Ljc5MiAxMS4xMzYtMTcuNzkyIDI4LjkyOCAwIDQwLjA2NGwxNTUuODQgMTAwLjE2YzE3Ljc5MiAxMS4xMzYgMzEuMTY4IDQuNDggMzEuMTY4LTE3Ljc5MmwwLTY0LjU3NiAzMzYuMTI4IDBjODQuNjA4IDAgMTY2Ljk3Ni0zMy40MDggMjI3LjA3Mi05My41MDQgMzcuODI0LTM3LjgyNCA2Ni43NTItODQuNjA4IDgwLjEyOC0xMzUuODA4Qzg2MS41MDQgNjE1LjYxNiA4MzIuNTc2IDYyMi4yNzIgODAzLjY0OCA2MjQuNTEyek03NzkuMTM2IDY3Ljk2OGMtMTM1LjgwOCAwLTI0NC44NjQgMTA5LjA1Ni0yNDQuODY0IDI0NC44NjRzMTA5LjA1NiAyNDQuODY0IDI0NC44NjQgMjQ0Ljg2NFMxMDI0IDQ0OC42NCAxMDI0IDMxMi44MzIgOTE0Ljk0NCA2Ny45NjggNzc5LjEzNiA2Ny45Njh6TTgyMy42OCA0NDQuMTZsLTQ2LjcyIDBMNzc2Ljk2IDI1OS40NTZjLTE3Ljc5MiAxNS41NTItMzcuODI0IDI2LjY4OC02NC41NzYgMzUuNjQ4TDcxMi4zODQgMjQ2LjA4YzEzLjM3Ni0yLjI0IDI2LjY4OC04Ljg5NiA0MC4wNjQtMTcuNzkyIDEzLjM3Ni04Ljg5NiAyNi42ODgtMTcuNzkyIDM1LjY0OC0yOC45MjhsMzUuNjQ4IDBMODIzLjc0NCA0NDQuMTZ6Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsNjMwMCkiPjxwYXRoIGQ9Ik01MDMuMjEyIDM5OS42MmM0OC4wMi00Ny42MDMgMTA5LjgwOS02OC44MzEgMjAwLjM0OC02OC44MzFsNC42MjUgMCAwIDUxLjYzM2MwIDE2LjQ5IDExLjMzNCAyMi42NjMgMjUuMTg2IDEzLjcxNmwxMjQuMjY0LTgwLjI1NGMxMy44NTItOC45NDYgMTMuNzE3LTIzLjM3MS0wLjMwMS0zMi4wNTVsLTEyMy42NjItNzYuNjFjLTE0LjAxNy04LjY4NS0yNS40ODYtMi4yOTgtMjUuNDg2IDE0LjE5MmwwIDUxLjM3OC00LjYyNSAwYy0xMDUuNjA0IDAtMTgyLjI0MSAyNy4yMTItMjQxLjE4MSA4NS42MzktNTkuMDQ2IDU4LjUzMi02MC41ODkgMTEyLjg0OC02MS44MyAxNTYuNDkyLTAuNTMyIDE4LjcyNS0wLjk5MSAzNC44OTYtNS42NjcgNDkuNjU0LTEwLjUyMiAzMy4yMTQtMzguMDcgNjMuOTM1LTc3LjU3IDg2LjUwNC00OS43MDQgMjguNC0xMTYuNzk2IDQyLjkzMi0xOTMuOTY3IDQyLjA5Ni0wLjExLTAuMDAxLTAuMjItMC4wMDItMC4zMy0wLjAwMi0xNS44NjUgMC0yOC44MTQgMTIuNzcxLTI4Ljk5MiAyOC42NzctMC4xNzkgMTYuMDE1IDEyLjY1OSAyOS4xNDMgMjguNjc1IDI5LjMyMSAyLjQwMiAwLjAyNyA0Ljc5NSAwLjA0IDcuMTgyIDAuMDQgNDIuNzU4IDAgODIuODkyLTQuMjk4IDExOS4zOTYtMTIuNzkzIDM1LjkyNi04LjM2IDY4LjQ5OC0yMC44MDMgOTYuODExLTM2Ljk3OSA1Mi4xODctMjkuODE4IDg5LjE1Mi03Mi4yMDMgMTA0LjA4Ny0xMTkuMzQ3IDcuMTI5LTIyLjUwNSA3Ljc1MS00NC4zNzQgOC4zNTItNjUuNTIzQzQ1OS42NjcgNDc2LjQ1MyA0NjAuNjUxIDQ0MS44MSA1MDMuMjEyIDM5OS42MnpNMTIzLjM0NyAzMzAuODI2Yzk3LjAyNC0xLjA4NiAxNzguMTY0IDIyLjQ5NSAyMjguNDAxIDY2LjM5MSA1LjQ5OSA0LjgwNSAxMi4yOTkgNy4xNjMgMTkuMDcgNy4xNjMgOC4wNzkgMCAxNi4xMTYtMy4zNTcgMjEuODUtOS45MTkgMTAuNTM5LTEyLjA2MSA5LjMwNC0zMC4zODEtMi43NTYtNDAuOTE5LTI5LjE4MS0yNS40OTctNjUuNjk1LTQ1LjM4OC0xMDguNTI5LTU5LjEyLTQ2LjcyOC0xNC45NzktMTAwLjExMi0yMi4yNS0xNTguNjgyLTIxLjU5MS0xNi4wMTUgMC4xNzktMjguODUzIDEzLjMwNi0yOC42NzQgMjkuMzIyQzk0LjIwMyAzMTguMTY3IDEwNy4zMTQgMzMxLjA0NCAxMjMuMzQ3IDMzMC44MjZ6TTg1Ny4zMzQgNzA0LjI1bC0xMjMuNjYyLTc2LjYxYy0xNC4wMTctOC42ODUtMjUuNDg2LTIuMjk4LTI1LjQ4NiAxNC4xOTJsMCA1MS4zNzktNC42MjUgMGMtODAuOTYgMC0xNDMuMTI4LTI0LjI0Ny0xOTUuNjQ1LTc2LjMwNy0xMS4zNzUtMTEuMjc0LTI5LjczNy0xMS4xOTYtNDEuMDEyIDAuMTgtMTEuMjc1IDExLjM3NC0xMS4xOTUgMjkuNzM2IDAuMTggNDEuMDEyIDYzLjIwNyA2Mi42NTcgMTQwLjU2IDkzLjExNSAyMzYuNDc3IDkzLjExNWw0LjYyNSAwIDAgNTEuNjMyYzAgMTYuNDkgMTEuMzM0IDIyLjY2MyAyNS4xODYgMTMuNzE2bDEyNC4yNjQtODAuMjU0Qzg3MS40ODYgNzI3LjM1OSA4NzEuMzUyIDcxMi45MzQgODU3LjMzNCA3MDQuMjV6Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsNzM1MCkiPjxwYXRoIGQ9Ik01MzIuODcyMzc3IDEzOC4wNjk1ODljLTguNjc1NTkgMC0xNy41NDU2MDggMi44Mzc2MjgtMjUuMjQyOTE3IDkuMTU1NTIxTDI5MS4yOTg0MzYgMzM0LjIzNTM0bC0xNTIuMTIxNjMgMC4yMjMwODFjLTMyLjkyMjgzIDAuMDUwMTQyLTU5LjYwMDQyMyAyNi40MDIzMjMtNTkuNjQ3NDk1IDU4LjkyNjA2NGwtMC4zNzY1NzcgMjU2LjIxMDI4OWMtMC4wNzQ3MDEgMzIuNjQ0NDkxIDI2LjY5Mzk2NSA1OS4xNDUwNTIgNTkuNzM5NTkzIDU5LjE0NTA1MmwxNTQuMzQzMjI3LTAuMDA5MjEgMjEzLjQxMDUwOCAxNjguMDYwNjQ3YzcuNjkxMTY5IDYuMzAzNTY2IDE2LjU1NzA5NCA5LjEzOTE0OCAyNS4yMjI0NTEgOS4xMzkxNDggMjAuNTc1NjE4IDAgNDAuMDMwNzE1LTE1Ljk3MzgxIDQwLjAzMDcxNS0zOS40MTY3MzFsMS4wMDU5MS02NjkuMDI4MzgzQzU3Mi45MDQxMTUgMTU0LjA0MjM3NSA1NTMuNDQzOTAxIDEzOC4wNjk1ODkgNTMyLjg3MjM3NyAxMzguMDY5NTg5ek01MTIuOTMyMjMyIDgwNi42MDA2NDUgMzI5Ljc0NjA5NiA2NjIuMzQwMDUzYy0xMC40MDcwMjQtOC4xOTQ2MzYtMjMuMjY2OTEzLTEyLjY1MTEzNS0zNi41MTE1NjUtMTIuNjUxMTM1bC0wLjAwNDA5MyAwLTE1NS4wNTQ0MjUtMC4wMDcxNjMgMS4wODU3MjgtMjU2LjE4MTYzNyAxNTIuMTIxNjMtMC4yMjMwODFjMTQuMTQzMTE1LTAuMDIxNDg5IDI3LjgwNzMyMy01LjExOTYwMSAzOC41MDkwNTktMTQuMzcxMzEyTDUxMy44MTUzNDUgMjE5LjkxMTU3MiA1MTIuOTMyMjMyIDgwNi42MDA2NDV6TTY4Ny45NDAxMDUgMzE3Ljg4NDk1NGMtMTMuNTg0MzktOS4wMzI3MjQtMzEuODk1NDMxLTUuMzI0MjYyLTQwLjkwNjY2NSA4LjI0NDc3OC05LjAzMDY3NyAxMy41ODg0ODMtNS4zMjIyMTYgMzEuOTAzNjE3IDguMjQyNzMxIDQwLjkxNzkyMiA0Ni4wMzY0OTkgMzAuNTk2ODU1IDczLjUxMjI3MSA4MS4zNTQ4ODkgNzMuNTEyMjcxIDEzNS43ODQ1NDYgMCA1Mi4zMzM5MjYtMjUuODIzMTMyIDEwMS45NTgxMzYtNjkuMDkyNjExIDEzMi43NDczNzMtMTMuMjc2Mzc1IDkuNDU2MzczLTE2LjM2OTgyOSAyNy44ODcxNDEtNi45MzU5NjkgNDEuMTg3MDUxIDUuNzY0Mjg0IDguMDkxMjgyIDE0Ljg1MjI2NiAxMi4zOTYzMzEgMjQuMDc1MzI1IDEyLjM5NjMzMSA1LjkxNzc4IDAgMTEuODkyODY1LTEuNzY4MjczIDE3LjEwMDQ3LTUuNDU4MzE1IDU4Ljc3NTYzOC00MS44NTkzNjMgOTMuODc5MTM0LTEwOS40NzMyOTcgOTMuODc5MTM0LTE4MC44NzI0NEM3ODcuODEzNzY2IDQyOC41Njg4MjIgNzUwLjQ4MTUxIDM1OS40MzczMjUgNjg3Ljk0MDEwNSAzMTcuODg0OTU0ek04MTMuMjE0MjczIDIxMC4yOTU1NjRjLTEyLjE4MTQzNy0xMC44Mzk4ODMtMzAuNzk5NDctOS44MDIyNS00MS42NzUxNjggMi4zNjM4MzctMTAuODU2MjU1IDEyLjE2NjA4Ny05Ljc5OTE4IDMwLjgyODEyMyAyLjM2MjgxNCA0MS42ODY0MjUgNzEuMTMwMDE0IDYzLjUxOTY4NiAxMTEuOTIxMDQ2IDE1NC4xMDA3MDQgMTExLjkyMTA0NiAyNDguNDg2Mzc0IDAgOTIuMDgwMTYyLTM3LjE5ODIwNCAxNzcuOTg5Nzg3LTEwNC43MzQzNjYgMjQxLjg5NDIzNi0xMS44MzU1NTkgMTEuMjA1MjAzLTEyLjM1NDM3NiAyOS44ODU2NTgtMS4xNTMyNjYgNDEuNzQ0NzUzIDUuODAyMTQ2IDYuMTMwNjI3IDEzLjYyMjI1MiA5LjIyNTEwNSAyMS40NDIzNTggOS4yMjUxMDUgNy4yODE4NDcgMCAxNC41ODMxMzctMi42NzE4NTIgMjAuMjkwMTE1LTguMDcxODM5IDc5LjQzMDA1LTc1LjE4NjQgMTIzLjE3OTQ2LTE3Ni4zMTc3MDUgMTIzLjE3OTQ2LTI4NC43OTEyMzJDOTQ0Ljg0ODI4OSAzOTEuNjQ4OTU4IDg5Ni44NzE2MDEgMjg1LjAxOTQyOSA4MTMuMjE0MjczIDIxMC4yOTU1NjR6Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsODQwMCkiPjxwYXRoIGQ9Ik05NTguNzA4OTcxIDYzMC4wMTk5NUw4NDAuNjcxNjI1IDUxMS45OTc5NTNsMTE4LjAyMTk5Ny0xMTguMDM1My0zNi40MjA0OTEtMzYuNDE5NDY3LTExOC4wMjA5NzQgMTE4LjAzNjMyMy0xMTguMDM2MzIzLTExOC4wMTg5MjctMzYuNDE5NDY4IDM2LjQxOTQ2OCAxMTguMDM3MzQ3IDExOC4wMjA5NzMtMTE4LjAyMDk3NCAxMTguMDM1MyAzNi40MjA0OTEgMzYuNDIwNDkxIDExOC4wMTg5MjctMTE4LjAzNzM0NiAxMTguMDM5MzkzIDExOC4wMTg5MjcgMzYuNDE3NDIxLTM2LjQxODQ0NXpNNTUyLjY2NDE0MiAxMTguNjg5MTkzYy0xOC43NDU5NDYtNy45MTQyNS00MS40ODA3NC00LjQxNzYxMy01Ni41OTE5MDMgOC42NTgxOTNMMjY3LjQ3Njg5MSAzMjQuOTgwNTU5aC0xMjkuNjAxNzNjLTQwLjAyMjUyOSAwLTcyLjU4NTE1NSAzMS4wODkwNjYtNzIuNTg1MTU2IDY5LjMwMDM0M3YyMzUuMzI5NzI2YzAgMzguMjEwMjUzIDMyLjU2MjYyNyA2OS4yOTIxNTYgNzIuNTg1MTU2IDY5LjI5MjE1NkgyNjcuNDc1ODY3bDIyOC41OTUzNDkgMTk3LjYyNDk4NmM5LjY3NzQwNyA4LjM3MDY0NSAyMi4xODMyMzIgMTIuOTc5NjE2IDM1LjI2MjEwOCAxMi45Nzk2MTZhNTQuNDgxODQ1IDU0LjQ4MTg0NSAwIDAgMCAyMS4zMjg3NzEtNC4zMTMyMzZjMTkuMDE0MDUyLTguMDMyOTU0IDMxLjI5MDY1Ny0yNi4wNDYyMTMgMzEuMjkwNjU3LTQ1Ljg4NTA1VjE2NC41NzQyNDNjMC4wMDIwNDctMTkuODIxNDQxLTEyLjI3NDU1OC0zNy44MjY1MTQtMzEuMjg4NjEtNDUuODg1MDV6TTUzMS43OTA3NDIgODYwLjEzMjg2MmwtMC40NTQzNDggMC4yMDc3MzEtMjQ0LjAwNDI5My0yMTAuNjA0NjAySDEzNy44NzYxODRjLTExLjYxODYxOSAwLTIxLjA3NDk5MS05LjAyNjU4NC0yMS4wNzQ5OTEtMjAuMTI2Mzg2di0yMzUuMzI5NzI3YzAtMTEuMDk5ODAyIDkuNDU3Mzk2LTIwLjEzMzU0OSAyMS4wNzQ5OTEtMjAuMTMzNTQ5aDE0OS40NTU5MTdMNTMwLjY0OTc1NSAxNjMuNzg5MzY3bDEuNzkzODU2IDAuNzgzODUyLTAuNjUyODY5IDY5NS41NTk2NDN6Ij48L3BhdGg+PC9nPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsOTQ1MCkiPjxwYXRoIGQ9Ik0xNjIuNjg5MzEzIDY1Ljc4ODM1NWMtNTMuOTQwNTE2IDAtOTcuNjgzNzg2IDQzLjQ3MzExNy05Ny42ODM3ODYgOTcuMTAxNTI1IDAgNTMuNjIyMjY4IDQzLjczNDA2IDk3LjExOTk0NSA5Ny42ODM3ODYgOTcuMTE5OTQ1IDUzLjk1NDg0MyAwIDk3LjY4ODkwMy00My40ODc0NDQgOTcuNjg4OTAzLTk3LjExOTk0NUMyNjAuMzc4MjE2IDEwOS4yNTEyNCAyMTYuNjQzMTMyIDY1Ljc4ODM1NSAxNjIuNjg5MzEzIDY1Ljc4ODM1NUwxNjIuNjg5MzEzIDY1Ljc4ODM1NXpNMTYyLjY4OTMxMyAyMTEuNDU4MDM5Yy0yNi45NjMwOTUgMC00OC44MzQyMTgtMjEuNzE1NTgxLTQ4LjgzNDIxOC00OC41NTg5NDkgMC0yNi44MTc3ODYgMjEuODcxMTIzLTQ4LjU0MjU3NiA0OC44MzQyMTgtNDguNTQyNTc2IDI2Ljk2OTIzNSAwIDQ4Ljg0MDM1OCAyMS43MzQgNDguODQwMzU4IDQ4LjU0MjU3NkMyMTEuNTM3ODU3IDE4OS43MzMyNDkgMTg5LjY2NjczNCAyMTEuNDU4MDM5IDE2Mi42ODkzMTMgMjExLjQ1ODAzOUwxNjIuNjg5MzEzIDIxMS40NTgwMzl6TTE2Mi42ODkzMTMgMjExLjQ1ODAzOU0xNjIuNjg5MzEzIDc2NS40OTM0MTFjLTUzLjk0MDUxNiAwLTk3LjY4Mzc4NiA0My40ODIzMjctOTcuNjgzNzg2IDk3LjEwOTcxMiAwIDUzLjYyMzI5MSA0My43MzQwNiA5Ny4xMjA5NjggOTcuNjgzNzg2IDk3LjEyMDk2OCA1My45NTQ4NDMgMCA5Ny42ODg5MDMtNDMuNDg3NDQ0IDk3LjY4ODkwMy05Ny4xMjA5NjhDMjYwLjM3ODIxNiA4MDguOTY2NTI5IDIxNi42NDMxMzIgNzY1LjQ5MzQxMSAxNjIuNjg5MzEzIDc2NS40OTM0MTFMMTYyLjY4OTMxMyA3NjUuNDkzNDExek0xNjIuNjg5MzEzIDkxMS4xNjMwOTVjLTI2Ljk2MzA5NSAwLTQ4LjgzNDIxOC0yMS43MTU1ODEtNDguODM0MjE4LTQ4LjU1OTk3MiAwLTI2LjgxNTczOSAyMS44NzExMjMtNDguNTUwNzYzIDQ4LjgzNDIxOC00OC41NTA3NjMgMjYuOTY5MjM1IDAgNDguODQwMzU4IDIxLjczNTAyNCA0OC44NDAzNTggNDguNTUwNzYzQzIxMS41Mzc4NTcgODg5LjQzODMwNSAxODkuNjY2NzM0IDkxMS4xNjMwOTUgMTYyLjY4OTMxMyA5MTEuMTYzMDk1TDE2Mi42ODkzMTMgOTExLjE2MzA5NXpNMTYyLjY4OTMxMyA5MTEuMTYzMDk1TTE2Mi42ODkzMTMgNDE0LjM5OTEwMWMtNTMuOTQwNTE2IDAtOTcuNjgzNzg2IDQzLjQ4MzM1LTk3LjY4Mzc4NiA5Ny4xMTA3MzUgMCA1My42MjMyOTEgNDMuNzM0MDYgOTcuMTEwNzM1IDk3LjY4Mzc4NiA5Ny4xMTA3MzUgNTMuOTU0ODQzIDAgOTcuNjg4OTAzLTQzLjQ4NzQ0NCA5Ny42ODg5MDMtOTcuMTEwNzM1QzI2MC4zNzgyMTYgNDU3Ljg4MjQ1MiAyMTYuNjQzMTMyIDQxNC4zOTkxMDEgMTYyLjY4OTMxMyA0MTQuMzk5MTAxTDE2Mi42ODkzMTMgNDE0LjM5OTEwMXpNMTYyLjY4OTMxMyA1NjAuMDYwNTk5Yy0yNi45NjMwOTUgMC00OC44MzQyMTgtMjEuNzE1NTgxLTQ4LjgzNDIxOC00OC41NTA3NjMgMC0yNi44MjA4NTUgMjEuODcxMTIzLTQ4LjU1MDc2MyA0OC44MzQyMTgtNDguNTUwNzYzIDI2Ljk2OTIzNSAwIDQ4Ljg0MDM1OCAyMS43Mjk5MDcgNDguODQwMzU4IDQ4LjU1MDc2M0MyMTEuNTM3ODU3IDUzOC4zNDYwNDEgMTg5LjY2NjczNCA1NjAuMDYwNTk5IDE2Mi42ODkzMTMgNTYwLjA2MDU5OUwxNjIuNjg5MzEzIDU2MC4wNjA1OTl6TTE2Mi42ODkzMTMgNTYwLjA2MDU5OU0zODkuNDQ4ODUgMTg0LjE1NTIwN2w1MzkuNTE2NzA0IDBjMTYuNTQzNzkxIDAgMjkuOTc1NzA4LTEzLjM0MTg2NiAyOS45NzU3MDgtMjkuNzk5NyAwLTE2LjQ1ODg1Ny0xMy40MTc1OTEtMjkuNzk2NjMtMjkuOTc1NzA4LTI5Ljc5NjYzTDM4OS40NDg4NSAxMjQuNTU4ODc3Yy0xNi41NTMwMDEgMC0yOS45NzU3MDggMTMuMzM2NzUtMjkuOTc1NzA4IDI5Ljc5NjYzQzM1OS40NzMxNDEgMTcwLjgxMzM0MSAzNzIuOTA1MDU4IDE4NC4xNTUyMDcgMzg5LjQ0ODg1IDE4NC4xNTUyMDdMMzg5LjQ0ODg1IDE4NC4xNTUyMDd6TTM4OS40NDg4NSAxODQuMTU1MjA3TTkyOC45NjU1NTMgNDgyLjEyNzY0NSAzODkuNDQ4ODUgNDgyLjEyNzY0NWMtMTYuNTUzMDAxIDAtMjkuOTc1NzA4IDEzLjM0MTg2Ni0yOS45NzU3MDggMjkuNzk5NyAwIDE2LjQ1NzgzNCAxMy40MjI3MDcgMjkuNzk1NjA3IDI5Ljk3NTcwOCAyOS43OTU2MDdsNTM5LjUxNjcwNCAwYzE2LjU0Mzc5MSAwIDI5Ljk3NTcwOC0xMy4zMzY3NSAyOS45NzU3MDgtMjkuNzk1NjA3Qzk1OC45NDEyNjIgNDk1LjQ2OTUxMiA5NDUuNTA5MzQ1IDQ4Mi4xMjc2NDUgOTI4Ljk2NTU1MyA0ODIuMTI3NjQ1TDkyOC45NjU1NTMgNDgyLjEyNzY0NXpNOTI4Ljk2NTU1MyA0ODIuMTI3NjQ1TTkyOC45NjU1NTMgODM5LjY5OTQ4NCAzODkuNDQ4ODUgODM5LjY5OTQ4NGMtMTYuNTUzMDAxIDAtMjkuOTc1NzA4IDEzLjMzNjc1LTI5Ljk3NTcwOCAyOS43OTQ1ODNzMTMuNDIyNzA3IDI5Ljc5OTcgMjkuOTc1NzA4IDI5Ljc5OTdsNTM5LjUxNjcwNCAwYzE2LjU0Mzc5MSAwIDI5Ljk3NTcwOC0xMy4zNDE4NjYgMjkuOTc1NzA4LTI5Ljc5OTdTOTQ1LjUwOTM0NSA4MzkuNjk5NDg0IDkyOC45NjU1NTMgODM5LjY5OTQ4NEw5MjguOTY1NTUzIDgzOS42OTk0ODR6TTkyOC45NjU1NTMgODM5LjY5OTQ4NCI+PC9wYXRoPjwvZz48L3N2Zz4=) no-repeat 50% 0;background-size:100%;opacity:0.8;cursor:pointer;}
    .msc-icon:hover{opacity:1;}
    .music-lrc{position:relative;display:-webkit-flex;display:flex;flex:1;justify-content:center;margin-bottom:1em;overflow:auto;}
    .music-lrc>.loading-wrap{display:-webkit-flex;display:flex;align-items:center;}
    .music-i{position:absolute;z-index:-1;width:100%;height:100%;filter:blur(5px);background:none no-repeat 50% 50%;background-size:cover;}
    .music-i:before{display:block;content:"";width:100%;height:100%;background:rgba(0,0,0,.8);}

    .music-footer{height:20%;width:90%;min-height:120px;margin:0 auto;}
    .music-progress{position:relative;height:20px;margin:0 10px;background:rgba(0,0,0,0);opacity:.8;}
    .music-progress:before{position:relative;display:block;content:"";top:8px;left:-10px;width:100%;height:4px;border-radius:2px;padding:0 10px;background:#FFF;}
    .progress-bar{position:absolute;left:-10px;top:8px;height:4px;width:0;background:#D55A1F;}
    .progress-bar:before{display:block;content:"";height:100%;width:15px;margin-left:-10px;border-radius:2px;background:#D55A1F;}
    .progress-dot{position:absolute;width:20px;height:20px;left:100%;top:-8px;margin-left:-10px;border-radius:50%;background:#FFF;box-shadow:0 0 5px #FFF;cursor:move;}
    .music-time{margin:.5em 0;}
    .music-btn-wrap{display:-webkit-flex;display:flex;justify-content:space-around;align-items:center;}

    .msc-circ-btn{background-position:50% 40%;}
    .msc-prev-btn{background-position:50% 20%;}
    .msc-play-btn{width:6vh;height:6vh;min-height:2em;min-width:2em;background-position:50% 10%;}
    .msc-next-btn{background-position:50% 30%;}
    .msc-sound-btn{width:60%;height:60%;background-position:50% 70%;}
    .msc-list-btn{width:2.4vh;height:2.4vh;background-position:50% 90%;}
    .msc-pause-btn{background-position:50% 0;}
    .msc-one-btn{background-position:50% 50%;}
    .msc-rnd-btn{background-position:50% 60%;}
    .msc-mute-btn{background-position:50% 80%;}

    .msc-lrc-list{margin:0;padding:0 6%;list-style-type:none;font-size:14px;color:rgba(255,255,255,.5);}
    .msc-lrc-list>li{margin:.5em 0;-webkit-transform:color .5s;transform:color .5s;}
    .msc-lrc-list>li.cur{color:rgba(255,255,255,1);}
    .msc-lrc-list>li:last-child{margin-bottom:5em;}

    .mini-player{padding-bottom:4em;}
    .mini-player>.music-player{display:-webkit-flex;display:flex;border-top:1px solid #CCC;flex-direction:row;align-items:flex-start;margin-top:-4em;-webkit-transform:translateY(100%);transform:translateY(100%);}
    .mini-player>.music-player .header-inner{position:static;padding-top:.5em;}
    .mini-player>.music-player .header-left,
    .mini-player>.music-player .header-right,
    .mini-player>.music-player .music-lrc,
    .mini-player .music-progress,
    .mini-player .music-time,
    .mini-player .msc-circ-btn,
    .mini-player .msc-list-btn{display:none;}
    .mini-player>.music-player .header{width:65%;padding-top:0;}
    .mini-player>.music-player .header-title{text-align:left;font-size:1em;align-self:flex-start;}
    .mini-player .music-footer{width:10em;margin:0;padding:1em 3% 0 0;}
    .mini-player  .msc-icon{width:2em;height:2em;}
</style>

<script>
    import HeaderBar from "./HeaderBar.vue"
    import PlayLists from "./PlayLists.vue"

    export default{
        data(){
           return {
               title:"",
               singer:"",
               headerTitle:"",
               headerRight:"<i class=\"msc-icon msc-sound-btn\"></i>",
               showLists:false
           }
        },
        watch:{
            singer:function(value){
                this.headerTitle=this.title+'<div class="c4 f1s">'+value+'</div>';
            }
        },
        methods:{
           showPlayLists(){
              this.showLists=true;
           },
           hidePlayLists(){
              this.showLists=false;
           },
           decode: (function(){
             const  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
           
                function _utf8_decode(utftext) {
                    var string = "";
                    var i = 0;
                    var c = 0;
                    var c3 = 0;
                    var c2 = 0;
                    while (i < utftext.length) {
                        c = utftext.charCodeAt(i);
                        if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                        } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                        } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                        }
                    }
                    return string;
                }

                return function (input) {
                    var output = "";
                    var chr1, chr2, chr3;
                    var enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                    while (i < input.length) {
                    enc1 = _keyStr.indexOf(input.charAt(i++));
                    enc2 = _keyStr.indexOf(input.charAt(i++));
                    enc3 = _keyStr.indexOf(input.charAt(i++));
                    enc4 = _keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                    }
                    output = _utf8_decode(output);
                    return output;
                }            
            })()
        },
        mounted(){
            this.musicModule.init(this); 
        },
        components:{
            HeaderBar,
            PlayLists
        }
        
    }
</script>