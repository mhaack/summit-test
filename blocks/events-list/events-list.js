import ffetch from '../../scripts/ffetch.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Fetches events data from the events index
 * @returns {Promise<Array>} The events data
 */
async function fetchEvents() {
  try {
    const events = await ffetch('/events-index.json').all();
    const filtered = events.filter((item) => item.path !== '/events');
    return filtered || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading events:', error);
    return [];
  }
}

/**
 * Creates an event list item element
 * @param {Object} event The event data
 * @returns {HTMLElement} The event list item
 */
function createEventElement(event) {
  const li = document.createElement('li');

  // add the event image
  const imgWrapper = document.createElement('div');
  imgWrapper.classList.add('event-image');
  const img = createOptimizedPicture(event.image, event.title);
  imgWrapper.append(img);
  li.append(imgWrapper);

  // add the event title and description
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('event-content');
  const title = document.createElement('h3');

  const link = document.createElement('a');
  link.href = event.path;
  link.textContent = event.title;
  title.append(link);
  contentWrapper.append(title);
  if (event.description) {
    const desc = document.createElement('p');
    desc.textContent = event.description;
    contentWrapper.append(desc);
  }
  li.append(contentWrapper);

  return li;
}

/**
 * Decorates the events list block
 * @param {HTMLElement} block The events list block element
 */
export default async function decorate(block) {
  try {
    const events = await fetchEvents();

    const ul = document.createElement('ul');
    ul.classList.add('events-list');
    events.forEach((event) => {
      const li = createEventElement(event);
      ul.append(li);
    });

    block.textContent = '';
    block.append(ul);
  } catch (error) {
    block.textContent = 'Unable to load events';
  }
}