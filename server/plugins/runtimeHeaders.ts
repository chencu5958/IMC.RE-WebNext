// Runtime Headers Plugin
export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('render:response', (response) => {
        if (!response.headers) {
            response.headers = {}
        }

        // 获取 runtimeConfig
        const runtimeConfig = useRuntimeConfig()
        const siteName = runtimeConfig.public.siteName || 'RoidMC Studios'
        const siteEnv = runtimeConfig.public.horizon.appEnv || 'Unknown Environment'
        const siteVersion = runtimeConfig.public.horizon.packageVersion || 'Unknown Version'
        const siteGitBranch = runtimeConfig.public.horizon.gitBranch || 'Unknown'
        const siteGitCommit = runtimeConfig.public.horizon.gitHash || 'Unknown'
        const siteBuildID = runtimeConfig.public.horizon.buildId || 'unknown'
        const siteBuildTime = runtimeConfig.public.horizon.buildTime || 'Unknown build time'
        //const siteFramework = runtimeConfig.public.siteFramework || 'Horizon Framework'

        // 设置自定义 header
        response.headers['X-Horizon-Server'] = `${siteName}-${siteEnv}`
        response.headers['X-Horizon-Build'] = `${siteVersion}-${siteGitCommit}-${siteGitBranch}`
        response.headers['X-Horizon-Build-ID'] = siteBuildID
        response.headers['X-Horizon-Build-Time'] = siteBuildTime
        //response.headers['X-Powered-By'] = siteFramework

        // 开发模式下输出调试信息
        // 控制台输出当前 header（用于调试）
        //console.log('Custom headers added:', response.headers)
        //console.log('Runtime config public:', runtimeConfig.public.gtag)
        //console.log('Environment check - runtimeConfig.public.siteName:', runtimeConfig.public.siteName)
        //console.log(runtimeConfig.public.horizon)
        /** 
        if (process.env.NODE_ENV === 'development') {
            console.log('🏗️  Runtime Headers Applied:')
            console.log('  - Site Build ID:', siteBuildID)
            console.log('  - Git Hash:', siteGitCommit)
            console.log('  - Git Branch:', siteGitBranch)
            console.log('  - Build Time:', siteBuildTime)
        }*/
    })
})