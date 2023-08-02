import * as service from '../service';

describe('When translating phrase', () => {
  it('should return reversed string', () => {
    // ARRANGE
    const phrase = 'hello';

    // ACT
    const translated = service.translatePhrase(phrase);

    // ASSERT
    expect(translated).toEqual('olleh');
  });

  describe('with empty string', () => {
    it('should return empty string', () => {
      // ARRANGE
      const phrase = '';

      // ACT
      const translated = service.translatePhrase(phrase);

      // ASSERT
      expect(translated).toEqual('');
    });
  });

  describe('with no phrase', () => {
    it('should return empty string', () => {
      // ARRANGE
      const phrase = undefined;

      // ACT
      const translated = service.translatePhrase(phrase);

      // ASSERT
      expect(translated).toEqual('');
    });
  });
});
