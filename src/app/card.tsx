import Image from "next/image";
import { forwardRef } from "react";

type CardProps = {
  id: string;
  frontSrc: string;
  frontAlt: string;
  backText: string;
};

// ✅ forwardRef must use (props, ref)
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ id, frontSrc, frontAlt, backText }, ref) => {
    return (
      <div className="card" id={id} ref={ref}>
        <div className="card-wrapper">
          <div className="flip-card-inner">
            {/* FRONT */}
            <div className="flip-card-front">
              <Image
                priority
                src={frontSrc}
                alt={frontAlt}
                fill
                style={{ objectFit: "cover", borderRadius: "0.8em" }}
              />
            </div>

            {/* BACK */}
            <div className="flip-card-back">
              <p>{backText}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// ✅ Required: give displayName when using forwardRef
Card.displayName = "Card";

export default Card;
