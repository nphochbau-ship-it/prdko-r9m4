import asyncio,sys
from playwright.async_api import async_playwright
U=sys.argv[1];VW,VH,TAG=int(sys.argv[2]),int(sys.argv[3]),sys.argv[3];SH='/workspace/smrdibuba/shots-v3/'+TAG+'-'
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx=await b.new_context(viewport={'width':VW,'height':VH},device_scale_factor=3,is_mobile=True,has_touch=True)
    pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    await pg.goto(U+'?mute');await pg.wait_for_timeout(1200);await pg.screenshot(path=SH+'01-meni.png')
    await pg.mouse.click(VW/2,VH*0.7);await pg.wait_for_timeout(2500);print('st',await pg.evaluate('__sb.st'))
    await pg.screenshot(path=SH+'02-livada.png')
    await pg.evaluate('__sb.jump()');await pg.wait_for_timeout(200);await pg.screenshot(path=SH+'03-skok.png')
    await pg.wait_for_timeout(600);await pg.evaluate('__sb.slide()');await pg.wait_for_timeout(150);await pg.screenshot(path=SH+'04-klizi.png')
    for i,(z,pw) in enumerate([(1,'magnet'),(2,'maska'),(3,'patike')]):
      await pg.evaluate(f'__sb.zone({z})');await pg.wait_for_timeout(2500);await pg.evaluate(f"__sb.give('{pw}')");await pg.wait_for_timeout(900)
      await pg.screenshot(path=SH+f'0{5+i}-zona{z}-{pw}.png')
    await pg.evaluate("__sb.give('vent')");await pg.wait_for_timeout(1500);await pg.screenshot(path=SH+'08-ventilator-bubaUF.png')
    await pg.evaluate('const s=__sb.S;for(const k in s.pw)s.pw[k]=0;s.lead=3;s.stun=1;s.inv=0');await pg.wait_for_timeout(2200);print('st',await pg.evaluate('__sb.st'));await pg.screenshot(path=SH+'09-fuj.png')
    r=await pg.evaluate("(()=>{const c=document.getElementById('c'),r=c.getBoundingClientRect();return [r.left,r.top,r.width/216,c.height]})()")
    await pg.mouse.click(r[0]+108*r[2],r[1]+(r[3]/2+66)*r[2]);await pg.wait_for_timeout(500);print('after opet',await pg.evaluate('__sb.st'))
    # natural survival: no input for a while
    await pg.wait_for_timeout(15000);print('auto st',await pg.evaluate('__sb.st'),await pg.evaluate('__sb.S.dist|0'))
    print('sw',await pg.evaluate('navigator.serviceWorker.controller?1:0'),'best',await pg.evaluate("localStorage.getItem('smrdi-best')"))
    print('ERRS',errs)
asyncio.run(main())
