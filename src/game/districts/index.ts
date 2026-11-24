
// Register the playable districts before the game initializes its store.
import './saheed-nagar'
import './patia'
import { activateDistrict } from './active'
import { DEFAULT_DISTRICT } from './registry'

activateDistrict(DEFAULT_DISTRICT)
