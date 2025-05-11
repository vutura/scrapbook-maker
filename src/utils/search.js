// src/utils/search.js
export const enhanceSticker = (sticker, category) => {
    const baseTags = [
      sticker.id,
      category.toLowerCase(),
      ...sticker.alt.toLowerCase().split(' ')
    ];
  
    switch (category.toLowerCase()) {
      case 'cats':
      case 'dogs':
      case 'bunnies':
        baseTags.push('animals', 'pets');
        break;
      case 'hello kitty':
      case 'pompompurin':
      case 'rilakkuma':
        baseTags.push('sanrio', 'kawaii', 'characters');
        break;
      case 'sailor moon':
        baseTags.push('anime', 'manga', 'magical girl');
        break;
      default:
        break;
    }
  
    return {
      ...sticker,
      tags: [...new Set(baseTags)],
      category
    };
  };
  
  export const filterStickers = (stickers, { tags, categories, searchTerm }) => {
    let filtered = [...stickers];
  
    if (categories?.length) {
      filtered = filtered.filter(sticker => 
        categories.includes(sticker.category.toLowerCase())
      );
    }
  
    if (tags?.length) {
      filtered = filtered.filter(sticker =>
        tags.some(tag => sticker.tags.includes(tag.toLowerCase()))
      );
    }
  
    if (searchTerm) {
      filtered = filtered.filter(sticker =>
        sticker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sticker.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sticker.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
      );
    }
  
    return filtered;
  };