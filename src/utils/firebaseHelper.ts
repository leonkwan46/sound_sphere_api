import adminApp, { ServiceAccount } from 'firebase-admin'
import fs from 'fs/promises'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const filePath = path.join(__dirname, '../', 'config/', 'soundsphere-8e9c2-firebase-adminsdk-q8nc6-dcd89eaf5a.json')

let _sdkInitialized = false

const _initialise = async () => {
    try {
        const cert = await fs.readFile(filePath, 'utf8')
        const parsedCert = JSON.parse(cert)
        adminApp.initializeApp({
            credential: adminApp.credential.cert(parsedCert as ServiceAccount),
        })
        _sdkInitialized = true
    } catch (error) {
        console.error('Error initializing Firebase:', error)
        throw new Error('Firebase initialization failed')
    }
}

const _adminAuth = async () => {
    if (!_sdkInitialized) await _initialise()
        return adminApp.auth()
}

export const verifyIdToken = async (token: string) => {
    const auth = await _adminAuth()
    return auth.verifyIdToken(token)
}
