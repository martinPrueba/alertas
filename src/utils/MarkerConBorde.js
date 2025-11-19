export function createMarkerConBorde(gmaps, map, position, imageUrl, bordeColor) {
  class MarkerConBorde extends gmaps.OverlayView {
    constructor(position, imageUrl, bordeColor, map) {
      super();
      this.position = position;
      this.imageUrl = imageUrl;
      this.bordeColor = bordeColor;
      this.map = map;
      this.div = null;
      this.setMap(map);
    }

onAdd() {
  this.div = document.createElement("div");
  this.div.style.position = "absolute";
  this.div.style.transform = "translate(-50%, -50%)";
  this.div.style.cursor = "pointer"; // importante para UX

  this.div.innerHTML = `
    <img src="${this.imageUrl}"
         style="width:40px;height:40px;border:4px solid ${this.bordeColor};border-radius:8px;">
  `;

  // ⬅️ AQUI agregamos los eventos
  this.div.addEventListener("mouseover", (e) => {
    if (this.onMouseOver) this.onMouseOver(e);
  });

  this.div.addEventListener("mouseout", (e) => {
    if (this.onMouseOut) this.onMouseOut(e);
  });

  this.div.addEventListener("click", (e) => {
    e.stopPropagation();
    if (this.onClick) this.onClick(e);
  });

  this.div.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    if (this.onDblClick) this.onDblClick(e);
  });

  this.getPanes().overlayImage.appendChild(this.div);
}



    draw() {
      const projection = this.getProjection();
      const point = projection.fromLatLngToDivPixel(this.position);

      if (point && this.div) {
        this.div.style.left = point.x + "px";
        this.div.style.top = point.y + "px";
      }
    }

    onRemove() {
      if (this.div) {
        this.div.remove();
        this.div = null;
      }
    }
  }

  return new MarkerConBorde(position, imageUrl, bordeColor, map);
}
