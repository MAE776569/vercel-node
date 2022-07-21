function formatConfig(configList) {
  const formattedConfig = {}
  configList.forEach(({ key, value }) => {
    formattedConfig[key] = value
  })
  return formattedConfig
}

module.exports = formatConfig
