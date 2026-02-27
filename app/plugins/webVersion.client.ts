export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig()

    const styleTitle1 = `
    font-size: 20px;
    font-weight: 600;
    font-family: 'Helvetica', monospace;
    color: black; 
    border-radius: 3px 0 0 3px; 
    padding: 2px 2px 1px 10px; 
    background:rgb(255, 242, 0)
  `
    const styleTitle2 = `
    font-style: oblique;
    font-size:20px;
    font-weight: 400;
    font-family: 'Helvetica';
    color: white; 
    border-radius: 0 3px 3px 0; 
    padding: 2px 10px 1px 10px; 
    background: #212121
    `

    const styleContent = `
    font-family: 'Helvetica';
    color: rgb(30,152,255);
    `

    const styleCopyinfo = `
    font-family: 'Helvetica';
    color: #8b8b8b;
    `
    const title1 = 'IMC.RE'
    const title2 = 'SUS ඞ'
    const content = `
    
    🏡 官网: https://www.imc.re
    `

    const copyright = `
    © 2022 - ${new Date().getFullYear()} IMC.RE
    Designed by RoidMC Studios
    `

    console.log(`%c${title1} %c${title2} %c${content} %c${copyright}`, styleTitle1, styleTitle2, styleContent, styleCopyinfo)
})