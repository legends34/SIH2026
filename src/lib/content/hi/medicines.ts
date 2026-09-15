import type { en } from '../en/index';
type Shape = DeepStringify<typeof en.medicines>;
type DeepStringify<T> = { [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string };

export const medicines: Shape = {
  title: 'दवाइयाँ',
  search: {
    label: 'दवाइयाँ खोजें',
    placeholder: 'दवाई का नाम डालें',
    noResults: 'दवाई नहीं मिली।',
  },
  dosage: 'मात्रा',
  frequency: 'कब लेनी है',
  duration: 'कितने दिन',
  instructions: 'निर्देश',
  refill: {
    button: 'दोबारा दवाई मँगवाएँ',
    success: 'अनुरोध भेज दिया गया। {pharmacy} से लें।',
    error: 'अनुरोध नहीं भेजा जा सका। फिर कोशिश करें।',
  },
  empty: 'कोई दवाई नहीं लिखी गई।',
};