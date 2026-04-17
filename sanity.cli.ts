/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'

// We hardcode these so the CLI always has access to them during deployment
const projectId = 'q31y36ab'
const dataset = 'production' 

export default defineCliConfig({ api: { projectId, dataset } })