vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

vec2 Rotate2D(vec2 value, float angle)
{
    float s = cos(angle);
    float c = sin(angle);
    mat2 m = mat2(c, s, s, -c);
    return m * value;
}